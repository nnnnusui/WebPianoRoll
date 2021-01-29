import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import Rest from "../rest/Rest";
import Roll from "../entity/Roll";

namespace Rolls {
  export const StateContext = createContext([] as ReturnType<typeof Roll>[]);
  export const DispatchContext = createContext({} as React.Dispatch<Action>);
  type Props = {
    rest: ReturnType<typeof Rest>;
  };
  export const Provider: React.FC<Props> = ({ children, rest }) => {
    const [state, dispatch] = useState<ReturnType<typeof Roll>[]>([]); //useReducer(getReducer(rest), [])
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

  type Rolls = typeof Roll[];
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
            .then((result) =>
              dispatch(result.map((it) => <Roll key={it.id} />))
            );
      }
    };
  };
  type ReducerType = (state: Rolls, action: Action) => Rolls;
  // const getReducer = (rest: ReturnType<typeof Rest>): ReducerType => {
  //     return (state, action) => {
  //         switch(action) {
  //             case Action.init:
  //                 const x = rest.roll.getAll().then(it=> resolve(it.map(()=> <Roll />)))
  //         }
  //         return state
  //     }
  // }
  // const test = (rest: ReturnType<typeof Rest>) => {
  //     return async (state: Rolls, action: Action) => {
  //         const result = await rest.roll.getAll().then(it=> it.map(()=> <Roll />))
  //         return result
  //     }
  // }
}

const Context = {
  rolls: {
    State: () => useContext(Rolls.StateContext),
    Dispatch: () => useContext(Rolls.DispatchContext),
  },
  Provider: Rolls.Provider,
};
export default Context;
