import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import busLogo from "./assets/bus.svg";
import type { Marker } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useState, useRef, useEffect } from "react";

type Point = google.maps.LatLngLiteral & { key: string };
type Props = {
  points: Point[];
  handleClick: (position: google.maps.LatLngLiteral) => void;
};

const Markers = ({ points, handleClick }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

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

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          position={point}
          key={point.key}
          onClick={() => handleClick(point)}
          ref={(marker) => setMarkerRef(marker, point.key)}
        >
          <img src={busLogo} alt="React Logo" style={{ width: 40 }} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Markers;
