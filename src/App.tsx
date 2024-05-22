"use client";

import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Markers from "./Markers";
import { useQuery } from "@tanstack/react-query";

async function fetchStops() {
  const response = await fetch("http://localhost:8000/api/stop/");
  if (!response.ok) {
    throw new Error("Could not fetch stops");
  }
  return response.json();
}

function App() {
  const [position, setPosition] = useState({
    lat: -34.87859994296411,
    lng: -56.08020979067669,
  });
  const [open, setOpen] = useState({
    position: position,
    isOpen: false,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["stops"],
    queryFn: fetchStops,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

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
          {isPending && <p>Loading...</p>}
          {isError && <p>Error: {error.message}</p>}
          {data && <Markers points={data} handleClick={handleMarkerClick} />}
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
