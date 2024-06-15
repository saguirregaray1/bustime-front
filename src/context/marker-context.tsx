import React, { createContext, useState, useContext } from "react";

type ActiveMarkerContextType = {
  activeMarkerId: string | null;
  setActiveMarkerId: (id: string | null) => void;
};

const ActiveMarkerContext = createContext<ActiveMarkerContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const ActiveMarkerProvider = ({ children }: Props) => {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  return (
    <ActiveMarkerContext.Provider value={{ activeMarkerId, setActiveMarkerId }}>
      {children}
    </ActiveMarkerContext.Provider>
  );
};

export const useActiveMarker = (): ActiveMarkerContextType => {
  const context = useContext(ActiveMarkerContext);
  if (!context) {
    throw new Error(
      "useActiveMarker must be used within a ActiveMarkerProvider"
    );
  }
  return context;
};
