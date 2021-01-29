import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import Roll from "../entity/Roll";
import Rest from "../rest/Rest";

type Action = typeof Action[keyof typeof Action];
const Action = {
  init: {
    type: "init",
  },
  create: {
    type: "create"
  }
} as const;

type Rester = ReturnType<typeof Rest>["roll"];
const getAsyncCallback = (
  rest: Rester,
  dispatch: React.Dispatch<ReturnType<typeof Roll>[]>
) => {
  return (action: Action) => {
    switch (action) {
      case Action.init:
        rest
          .getAll()
          .then((result) =>
            dispatch(result.map((it, index) => <Roll key={index} {...it} />))
          );
    }
  };
};

const StateContext = createContext([] as ReturnType<typeof Roll>[]);
const DispatchContext = createContext({} as React.Dispatch<Action>);

type Props = {
  rest: Rester;
};
const Provider: React.FC<Props> = ({ children, rest }) => {
  const [state, dispatch] = useState<ReturnType<typeof Roll>[]>([]);
  const dispatchAsync = useCallback(getAsyncCallback(rest, dispatch), []);

  useEffect(() => {
    if(state.length == 0)
      dispatchAsync(Action.init);
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
