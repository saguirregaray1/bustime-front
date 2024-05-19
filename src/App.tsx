"use client";

import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import Markers from "./Markers";
import trees from "./markersData";

function App() {
  const position = { lat: 43.64, lng: -79.41 };
  const [open, setOpen] = useState({
    position: position,
    isOpen: false,
  });

  function handleMarkerClick(position: google.maps.LatLngLiteral) {
    setOpen({ position: position, isOpen: true });
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY || ""}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map
          defaultZoom={17}
          defaultCenter={position}
          mapId={import.meta.env.VITE_MAP_ID}
        >
          <Markers points={trees} handleClick={handleMarkerClick} />
        </Map>

        {open.isOpen && (
          <InfoWindow
            position={open.position}
            onCloseClick={() =>
              setOpen({
                position: position,
                isOpen: false,
              })
            }
            onClose={() =>
              setOpen({
                position: position,
                isOpen: false,
              })
            }
          >
            <p>Datos de la parada</p>
          </InfoWindow>
        )}
      </div>
    </APIProvider>
  );
}

export default App;
