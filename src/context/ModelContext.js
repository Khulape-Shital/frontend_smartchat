"use client";
import { createContext, useContext, useState } from "react";

const ModelContext = createContext(undefined);
export function ModelProvider({children}) {
  const [selected, setSelected] = useState("");

  return (
    <ModelContext.Provider value={{ selected, setSelected }}>
      {children}
    </ModelContext.Provider>
  );
}
export default function useModel() {
  return useContext(ModelContext);
}
