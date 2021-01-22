import React from "react";
import { useGridContext } from "./GridContext";
import { range0to } from "../range";
import ActionCell from "./ActionCell";

const ActionLayer: React.FC = () => {
  const [{ width, height }] = useGridContext();
  const style = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };
  return (
    <div className="absolute h-full w-full grid grid-flow-col" style={style}>
      {range0to(height * width).map((index) => {
        const pos = {
          x: Math.floor(index / height),
          y: index % height,
        };
        return <ActionCell key={index} {...{ pos }} />;
      })}
    </div>
  );
};

export default ActionLayer;
