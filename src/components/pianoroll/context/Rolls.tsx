import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { RollProps } from "../entity/Roll";
import Rest from "../rest/Rest";
import { RollRestData, RollRestOthers } from "../rest/Roll";

type Init = { type: "init" };
type Create = {
  type: "create";
  request: RollRestOthers;
};
type Update = {
  type: "update";
  request: RollRestData;
};
type Action = Init | Create | Update;

type Rester = ReturnType<typeof Rest>["roll"];
type Store = Map<number, RollProps>;
const getAsyncCallback = (
  rest: Rester,
  dispatch: React.Dispatch<React.SetStateAction<Store>>
) => {
  return (action: Action) => {
    switch (action.type) {
      case "init":
        rest
          .getAll()
          .then((result) => dispatch(new Map(result.map((it) => [it.id, it]))));
        break;
      case "create":
        rest
          .create(action.request)
          .then((result) =>
            dispatch((prev) => new Map(prev.set(result.id, result)))
          );
        break;
      case "update":
        rest
          .update(action.request)
          .then((result) =>
            dispatch((prev) => new Map(prev.set(result.id, result)))
          );
        break;
    }
  };
};

const initState: Store = new Map();
const StateContext = createContext(initState);
const DispatchContext = createContext({} as React.Dispatch<Action>);

type Props = {
  rest: Rester;
};
const Provider: React.FC<Props> = ({ children, rest }) => {
  const [state, dispatch] = useState<Store>(initState);
  const dispatchAsync = useCallback(getAsyncCallback(rest, dispatch), []);

  useEffect(() => {
    dispatchAsync({ type: "init" });
  }, [dispatchAsync]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatchAsync}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const Rolls = {
  State: () => useContext(StateContext),
  Dispatch: () => useContext(DispatchContext),
  Provider,
};
export default Rolls;
