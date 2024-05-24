import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ActiveMarkerProvider } from "./context/marker-context.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ActiveMarkerProvider>
        <App />
      </ActiveMarkerProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
