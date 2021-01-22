import React, { useState, createContext, useContext } from "react";

type ContextProps<T> = [T, (state: T) => void];
function GenerateContext<T>(
  initState: T
): {
  Provider: React.FC;
  UseContext: () => ContextProps<T>;
} {
  const init: ContextProps<T> = [initState, () => {}];
  const Context = createContext(init);
  const Provider: React.FC = ({ children }) => {
    const [state, setState] = useState(initState);
    return (
      <Context.Provider value={[state, setState]}>{children}</Context.Provider>
    );
  };
  const UseContext = () => useContext(Context);
  return { Provider, UseContext };
}

export default GenerateContext;
