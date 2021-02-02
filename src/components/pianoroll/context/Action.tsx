import React, { createContext, useState, useContext } from "react";

type ActionCell = { type: "ActionCell"; gridIndex: number };
type Note = {
  type: "Note";
  gridIndex: number;
  noteId: number;
  part: "left" | "right" | "center";
};
type RollListCell = {
  type: "RollListCell";
  rollId: number;
};
type ActionSource = ActionCell | Note | RollListCell;
type Value = {
  from: ActionSource;
  to: ActionSource;
  apply: boolean;
};
const initState = {} as Value;
const StateContext = createContext(initState);
const DispatchContext = createContext(
  {} as React.Dispatch<React.SetStateAction<Value>>
);
const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useState(initState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const Action = {
  State: () => useContext(StateContext),
  Dispatch: () => useContext(DispatchContext),
  Provider,
};
export default Action;
export type { ActionSource };
