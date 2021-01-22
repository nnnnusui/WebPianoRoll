import React, { useState, createContext, useContext } from "react";
type SelectionInfo = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

const initialState: SelectionInfo = {
  from: { x: 0, y: 0 },
  to: { x: 0, y: 0 },
};
const SelectionContext = createContext({
  selection: initialState,
  setSelection: (info: SelectionInfo) => {},
});
const SelectionProvider: React.FC = ({ children }) => {
  const [selection, setSelection] = useState(initialState);
  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};
const useSelectionContext = () => useContext(SelectionContext);
export { SelectionProvider, useSelectionContext };
export type { SelectionInfo };
