import React from "react";
import Rolls from "./Rolls";
import Rest from "../rest/Rest";
import RollSelection from "./RollSelection";

type Props = {
  rest: ReturnType<typeof Rest>;
};
const Provider: React.FC<Props> = ({ children, rest }) => {
  return (
    <Rolls.Provider rest={rest.roll}>
      <RollSelection.Provider>{children}</RollSelection.Provider>
    </Rolls.Provider>
  );
};

const Context = {
  roll: {
    selectedId: RollSelection,
  },
  rolls: Rolls,
  Provider,
};
export default Context;
