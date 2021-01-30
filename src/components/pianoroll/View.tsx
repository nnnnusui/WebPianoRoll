import React from "react";
import Context from "./context/Context";

const View: React.FC = () => {
  const roll = Context.roll.selected()?.element;
  if (roll == undefined) return <></>;

  return roll;
};
export default View;
