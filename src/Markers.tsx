import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import busLogo from "./assets/bus.svg";
import type { Marker } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useState, useRef, useEffect } from "react";

type Props = {
  points: { id: number; lat: number; lng: number }[];
};

const Markers = ({ points }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  const [open, setOpen] = useState<{
    position: google.maps.LatLngLiteral | undefined;
    isOpen: boolean;
  }>({
    position: undefined,
    isOpen: false,
  });

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    if (!clusterer.current) return;
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (!marker && !markers[key]) return;
    if (marker && markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };
  console.log("a");
  function handleClick(event: google.maps.MapMouseEvent) {
    setOpen({
      position: event.latLng?.toJSON(),
      isOpen: true,
    });
  }

  function handleClose() {
    setOpen({
      position: undefined,
      isOpen: false,
    });
  }

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          position={{ lat: point.lat, lng: point.lng }}
          key={point.id}
          onClick={handleClick}
          ref={(marker) => setMarkerRef(marker, point.id.toString())}
        >
          <img src={busLogo} alt="React Logo" style={{ width: 40 }} />
        </AdvancedMarker>
      ))}
      {open.isOpen && (
        <InfoWindow position={open.position} onClose={handleClose}>
          <h2>InfoWindow content!</h2>
          <p>Some arbitrary html to be rendered into the InfoWindow.</p>
        </InfoWindow>
      )}
    </>
  );
};

export default Markers;
