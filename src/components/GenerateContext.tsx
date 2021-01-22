import React, { useState, createContext, useContext } from "react";

type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
function GenerateContext<T>(
  initState: T
): {
  Provider: React.FC;
  UseContext: () => UseState<T>;
} {
  const state = useState(initState);
  const Context = createContext(state);
  const Provider: React.FC = ({ children }) => (
    <Context.Provider value={state}>{children}</Context.Provider>
  );
  const UseContext = () => useContext(Context);
  return { Provider, UseContext };
}

export default GenerateContext;
export type { UseState };
