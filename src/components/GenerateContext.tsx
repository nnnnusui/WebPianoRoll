import React, { useState, createContext, useContext } from "react";

type Dispatch<T> = (state: T) => void;
function GenerateContext<T>(
  initState: T
): {
  Provider: React.FC;
  state: () => T;
  dispatch: () => Dispatch<T>;
} {
  const stateContext = createContext(initState);
  const dispatchContext: React.Context<Dispatch<T>> = createContext(
    {} as Dispatch<T>
  );
  const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = useState(initState);
    return (
      <stateContext.Provider value={state}>
        <dispatchContext.Provider value={dispatch}>
          {children}
        </dispatchContext.Provider>
      </stateContext.Provider>
    );
  };
  return {
    Provider,
    state: () => useContext(stateContext),
    dispatch: () => useContext(dispatchContext),
  };
}

export default GenerateContext;
