import React, { createContext, useContext, useReducer } from "react";

const StateType = {
  set: "set",
  fire: "fire",
} as const;
type StateType = typeof StateType[keyof typeof StateType];
const ActionType = {
  none: "none",
  select: "select",
} as const;
type ActionType = typeof ActionType[keyof typeof ActionType];
type State = {
  before: StateType;
  current: StateType;
  action: ActionType;
};
type Action =
  | {
      state: "set";
      type: ActionType;
    }
  | {
      state: "fire";
    };
const initState: State = {
  current: StateType.fire,
  before: StateType.fire,
  action: ActionType.none,
};
const Context = () => {
  const stateContext = createContext<State>(initState);
  const dispatchContext = createContext({} as React.Dispatch<Action>);
  const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer((state: State, action: Action) => {
      const after = {
        before: state.current,
        current: action.state,
      };
      switch (action.state) {
        case StateType.set:
          console.log(action.state);
          return { ...after, action: action.type };
        case StateType.fire:
          console.log(`${action.state}, ${state.action}`);
          return {
            ...after,
            action: state.action,
          };
      }
    }, initState);
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
    State: () => useContext(stateContext),
    Dispatch: () => useContext(dispatchContext),
  };
};
const Action = Context();
export default Action;
export { StateType as ActionStateType, ActionType };
