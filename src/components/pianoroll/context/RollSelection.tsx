import React, { createContext, useState, useContext } from "react";

const initState = 1;
const StateContext = createContext(initState);
const DispatchContext = createContext({} as React.Dispatch<number>);
const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useState<number>(initState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const RollSelection = {
  State: () => useContext(StateContext),
  Dispatch: () => useContext(DispatchContext),
  Provider,
};
export default RollSelection;
