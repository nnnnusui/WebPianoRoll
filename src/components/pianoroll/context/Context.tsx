import React from "react";
import Rolls from "./Rolls";
import Rest from "../rest/Rest";
import RollSelection from "./RollSelection";
import Notes from "./Notes";
import Action from "./Action";

type Props = {
  rest: ReturnType<typeof Rest>;
};
const Provider: React.FC<Props> = ({ children, rest }) => {
  return (
    <Rolls.Provider rest={rest.roll}>
      <RollSelection.Provider>
        <Notes.Provider rest={rest.note}>
          <Action.Provider>{children}</Action.Provider>
        </Notes.Provider>
      </RollSelection.Provider>
    </Rolls.Provider>
  );
};

const Context = {
  action: Action,
  roll: {
    selectedId: RollSelection,
    selected: () => Rolls.State().get(RollSelection.State()),
  },
  rolls: Rolls,
  notes: Notes,
  Provider,
};
export default Context;
