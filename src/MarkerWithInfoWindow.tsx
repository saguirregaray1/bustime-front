import {
  useAdvancedMarkerRef,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import { useActiveMarker } from "./context/marker-context";
type Props = {
  position: google.maps.LatLngLiteral;
  children?: React.ReactNode;
  id: string | null;
};

const MarkerWithInfoWindow = ({ position, children, id }: Props) => {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const { activeMarkerId, setActiveMarkerId } = useActiveMarker();

  const infoWindowShown = activeMarkerId === id;

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
          <h2>InfoWindow content!</h2>
          <p>Some arbitrary html to be rendered into the InfoWindow.</p>
        </InfoWindow>
      )}
    </>
  );
};
export default MarkerWithInfoWindow;
