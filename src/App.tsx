"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Points from "./Points";

async function fetchStops() {
  const url = import.meta.env.VITE_SERVER_URL + "/api/stop/";
  const response = await fetch(url);
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
          {data && <Points points={data} />}
        </Map>
      </div>
    </APIProvider>
  );
}

export default App;
