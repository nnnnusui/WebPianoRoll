import { createContext, useState, useCallback, useEffect, useContext } from "react";
import Roll from "../entity/Roll";
import Rest from "../rest/Rest";

const StateContext = createContext([] as ReturnType<typeof Roll>[]);
const DispatchContext = createContext({} as React.Dispatch<Action>);
type Props = {
  rest: ReturnType<typeof Rest>;
};
const Provider: React.FC<Props> = ({ children, rest }) => {
  const [state, dispatch] = useState<ReturnType<typeof Roll>[]>([]);
  const dispatchAsync = useCallback(getAsyncCallback(rest, dispatch), []);

  useEffect(() => {
    dispatchAsync(Action.init);
  }, []);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatchAsync}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

type Action = typeof Action[keyof typeof Action];
const Action = {
  init: "init",
} as const;

const getAsyncCallback = (
  rest: ReturnType<typeof Rest>,
  dispatch: React.Dispatch<ReturnType<typeof Roll>[]>
) => {
  return async (action: Action) => {
    switch (action) {
      case Action.init:
        rest.roll
          .getAll()
          .then((result) => dispatch(result.map((it) => <Roll key={it.id} />)));
    }
  };
};

const Rolls = {
  State: () => useContext(StateContext),
  Dispatch: () => useContext(DispatchContext),
  Provider,
};
export default Rolls;
