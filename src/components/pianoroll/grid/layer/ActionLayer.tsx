import React from "react";
import { range0to } from "../../../range";
import ActionCell from "../cell/ActionCell";
import GetCell from "../GetCell";

type Props = {
  width: number;
  height: number;
};
const ActionLayer: React.FC<Props> = ({ width, height }) => {
  const onMouseDown = (event: React.MouseEvent) => {
    const gridIndex = GetCell().onMouseEvent(event).gridIndex
    console.log(gridIndex)
  }
  const style = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };
  return (
    <div
      className="absolute h-full w-full grid grid-flow-col"
      style={style}
      onMouseDown={onMouseDown}
    >
      {range0to(height * width).map((index) => {
        return <ActionCell key={index} {...{ gridIndex: index }} />;
      })}
    </div>
  );
};

export default ActionLayer;
