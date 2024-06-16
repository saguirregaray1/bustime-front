import {
  useAdvancedMarkerRef,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { useActiveMarker } from "./context/marker-context";
import useWebSocket from "react-use-websocket";
type Props = {
  position: google.maps.LatLngLiteral;
  children?: React.ReactNode;
  id: string | null;
};

const MarkerWithInfoWindow = ({ position, children, id }: Props) => {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).

  const [data, setData] = useState(null);

  const [markerRef, marker] = useAdvancedMarkerRef();

  const { activeMarkerId, setActiveMarkerId } = useActiveMarker();

  const infoWindowShown = activeMarkerId === id;

  let url = "";

  if (infoWindowShown) {
    url = import.meta.env.VITE_WS_URL + "/ws/socket-server/";
  }

  const { sendJsonMessage } = useWebSocket(url, {
    onMessage: (event) => {
      sendJsonMessage({ stop_id: id });
      console.log(event);
    },
    retryOnError: false,
  });

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(() => {
    setActiveMarkerId(id);
  }, [id, setActiveMarkerId]);

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => {
    if (activeMarkerId === id) {
      setActiveMarkerId(null);
    }
  }, [id, activeMarkerId, setActiveMarkerId]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        {children}
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <h2>Parada {id}</h2>
          {data}
        </InfoWindow>
      )}
    </>
  );
};
export default MarkerWithInfoWindow;
