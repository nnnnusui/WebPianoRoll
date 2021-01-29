import React from "react";
import Rolls from "./Rolls";
import Rest from "../rest/Rest";

type Props = {
  rest: ReturnType<typeof Rest>;
};
const Provider: React.FC<Props> = ({ children, rest }) => {
  return <Rolls.Provider rest={rest.roll}>{children}</Rolls.Provider>;
};

const Context = {
  rolls: {
    State: Rolls.State,
    Dispatch: Rolls.Dispatch,
  },
  Provider,
};
export default Context;
