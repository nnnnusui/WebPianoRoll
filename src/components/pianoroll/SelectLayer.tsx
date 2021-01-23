import React from "react";
import Grid from "./GridContext";
import SelectBox from "./SelectBox";

const SelectLayer: React.FC = () => {
  const [{ width, height }] = [Grid.state()];
  const style = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };
  return (
    <div
      className="pointer-events-none absolute h-full w-full grid grid-flow-col"
      style={style}
    >
      <SelectBox></SelectBox>
    </div>
  );
};

export default SelectLayer;
