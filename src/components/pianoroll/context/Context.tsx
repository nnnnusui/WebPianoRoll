import React from "react";
import Rolls from "./Rolls";
import Rest from "../rest/Rest";
import RollSelection from "./RollSelection";
import Notes from "./Notes";

type Props = {
  rest: ReturnType<typeof Rest>;
};
const Provider: React.FC<Props> = ({ children, rest }) => {
  return (
    <Rolls.Provider rest={rest.roll}>
      <RollSelection.Provider>
        <Notes.Provider rest={rest.note}>{children}</Notes.Provider>
      </RollSelection.Provider>
    </Rolls.Provider>
  );
};

const Context = {
  roll: {
    selectedId: RollSelection,
    selected: () => Rolls.State().get(RollSelection.State()),
  },
  rolls: Rolls,
  notes: Notes,
  Provider,
};
export default Context;
