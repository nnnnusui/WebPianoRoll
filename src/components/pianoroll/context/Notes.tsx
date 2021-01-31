import React, { createContext, useState, useCallback, useContext } from "react";
import { NoteRestData, NoteRestOthers } from "../rest/Note";
import Rest from "../rest/Rest";

type Premise = {
  rollId: number;
};
type GetAll = { type: "getAll" } & Premise;
type Create = {
  type: "create";
  request: NoteRestOthers;
} & Premise;
type Update = {
  type: "update";
  request: NoteRestData;
} & Premise;
type Action = GetAll | Create | Update;

type Rester = ReturnType<typeof Rest>["note"];
type RollId = number;
type NoteId = number;
const value = (data: NoteRestData) => {
  return { data };
};
type Store = Map<RollId, Map<NoteId, ReturnType<typeof value>>>;
const getAsyncCallback = (
  _rest: Rester,
  dispatch: React.Dispatch<React.SetStateAction<Store>>
) => {
  return (action: Action) => {
    const rollId = action.rollId;
    const rest = _rest(rollId);
    switch (action.type) {
      case "getAll":
        rest
          .getAll()
          .then((result) =>
            dispatch(
              new Map([
                [
                  rollId,
                  new Map(
                    result.map((it) => [it.id, { rollId, ...value(it) }])
                  ),
                ],
              ])
            )
          );
        break;
      case "create":
        rest
          .create(action.request)
          .then((result) => ({ rollId, ...result }))
          .then((it) =>
            dispatch(
              (prev) =>
                new Map(
                  prev.set(
                    it.rollId,
                    prev.get(it.rollId)!.set(it.id, value(it))
                  )
                )
            )
          );
        break;
      case "update":
        rest
          .update(action.request)
          .then((result) => ({ rollId, ...result }))
          .then((it) =>
            dispatch(
              (prev) =>
                new Map(
                  prev.set(
                    it.rollId,
                    prev.get(it.rollId)!.set(it.id, value(it))
                  )
                )
            )
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

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatchAsync}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const Notes = {
  State: () => useContext(StateContext),
  Dispatch: () => useContext(DispatchContext),
  Provider,
};
export default Notes;
