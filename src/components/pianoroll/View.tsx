import React from "react";
import Context from "./context/Context";
import Roll from "./entity/Roll";

const View: React.FC = () => {
  const roll = Context.roll.selected();
  if (roll == undefined) return <></>;

  return <Roll {...roll} />;
};
export default View;
