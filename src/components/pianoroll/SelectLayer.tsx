import React, { useState } from "react";
import SelectBox from "./SelectBox";
import { useGridContext } from "./GridContext";

const SelectLayer: React.FC = () => {
  const { size } = useGridContext();
  const initSelection = { from: { x: -1, y: -1 }, to: { x: -1, y: -1 } };
  const [selection, setSelection] = useState(initSelection);
  const max = {
    x: Math.max(selection.from.x, selection.to.x),
    y: Math.max(selection.from.y, selection.to.y),
  };
  const min = {
    x: Math.min(selection.from.x, selection.to.x),
    y: Math.min(selection.from.y, selection.to.y),
  };
  const { width, height } = size;
  const style = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };
  return (
    <div
      className="pointer-events-none absolute h-full w-full grid grid-flow-col"
      style={style}
    >
      <SelectBox {...{ min: { x: 1, y: 4 }, max: { x: 12, y: 6 } }}></SelectBox>
    </div>
  );
};

export default SelectLayer;
