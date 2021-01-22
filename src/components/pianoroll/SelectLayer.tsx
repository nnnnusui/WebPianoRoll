import React from "react";
import SelectBox from "./SelectBox";
import { useGridContext } from "./GridContext";

const SelectLayer: React.FC = () => {
  const {
    size: { width, height },
  } = useGridContext();
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
