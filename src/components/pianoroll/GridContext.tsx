import React, { useState, createContext, useContext } from "react";
type GridSize = {
  width: number;
  height: number;
};

const initialState: GridSize = { width: 0, height: 0 };
const GridContext = createContext({
  size: initialState,
  setSize: (size: GridSize) => {},
});
const GridProvider: React.FC = ({ children }) => {
  const [size, setSize] = useState(initialState);
  return (
    <GridContext.Provider value={{ size, setSize }}>
      {children}
    </GridContext.Provider>
  );
};
const useGridContext = () => useContext(GridContext);
export { GridProvider, useGridContext };
export type { GridSize };
