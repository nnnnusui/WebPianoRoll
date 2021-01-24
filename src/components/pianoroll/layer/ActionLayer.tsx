import React from "react";
import { range0to } from "../../range";
import ActionCell from "../action/ActionCell";
import Grid from "../contexts/GridContext";

const ActionLayer: React.FC = () => {
  const [{ width, height }] = [Grid.State()];
  const style = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };
  return (
    <div className="absolute h-full w-full grid grid-flow-col" style={style}>
      {range0to(height * width).map((index) => {
        return <ActionCell key={index} {...{ gridIndex: index }} />;
      })}
    </div>
  );
};

export default ActionLayer;
