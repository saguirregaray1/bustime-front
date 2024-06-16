import {
  useAdvancedMarkerRef,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useCallback, useState, useEffect } from "react";
import { useActiveMarker } from "./context/marker-context";
import busLogo from "./assets/upcoming_bus.png";
type Props = {
  position: google.maps.LatLngLiteral;
  children?: React.ReactNode;
  id: string | null;
};

const MarkerWithInfoWindow = ({ position, children, id }: Props) => {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).

  type Bus = {
    position: google.maps.LatLngLiteral;
    busLine: string;
    estimatedTime: number;
  };

  const [buses, setBuses] = useState<Bus[]>([]);

  const [ws, setWs] = useState<WebSocket | null>(null);

  const [markerRef, marker] = useAdvancedMarkerRef();

  const { activeMarkerId, setActiveMarkerId } = useActiveMarker();

  const infoWindowShown = activeMarkerId === id;

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        ws.send(JSON.stringify({ stop_id: id }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.paradaId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const upcomingBuses: Bus[] = data.upcoming_buses.map((bus: any) => {
            return {
              position: {
                lat: bus.location.coordinates[1],

                lng: bus.location.coordinates[0],
              },
              busLine: bus.line,
              estimatedTime: Math.floor(bus.eta / 60),
            };
          });
          setBuses(upcomingBuses);
        }
      };

      ws.onclose = () => {
        setBuses([]);
        if (activeMarkerId === id) {
          setActiveMarkerId(null);
        }
      };
    }
  });

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(() => {
    setActiveMarkerId(id);

    if (!ws) {
      const url = import.meta.env.VITE_WS_URL + "/ws/socket-server/";

      const socket = new WebSocket(url);

      setWs(socket);
    }
  }, [id, setActiveMarkerId, ws]);

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => {
    if (activeMarkerId === id) {
      setActiveMarkerId(null);
    }
    setBuses([]);
    ws?.close();
  }, [id, activeMarkerId, setActiveMarkerId, ws]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        {(activeMarkerId === null || infoWindowShown) && children}
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <div
            style={{
              padding: "10px",
              maxWidth: "150px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2 style={{ fontSize: "14px", margin: "0 0 10px 0", order: 1 }}>
              Parada {id}
            </h2>
            {buses.map((bus) => {
              return (
                <div
                  key={bus.busLine}
                  style={{ marginBottom: "10px", order: 2 }}
                >
                  <p style={{ margin: "0" }}>
                    <strong>{bus.busLine}:</strong>{" "}
                    <strong>{bus.estimatedTime} mins</strong>
                  </p>
                </div>
              );
            })}
          </div>
        </InfoWindow>
      )}

      {buses.map((bus) => {
        return (
          <AdvancedMarker key={bus.busLine} position={bus.position}>
            <img src={busLogo} alt="bus logo" style={{ width: 50 }} />
          </AdvancedMarker>
        );
      })}
    </>
  );
};
export default MarkerWithInfoWindow;
