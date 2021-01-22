import React from "react";
import { useSelectionContext } from "./SelectionContext";

const SelectBox: React.FC = () => {
  const {
    selection: { from, to },
  } = useSelectionContext();
  const max = {
    x: Math.max(from.x, to.x),
    y: Math.max(from.y, to.y),
  };
  const min = {
    x: Math.min(from.x, to.x),
    y: Math.min(from.y, to.y),
  };
  const style = {
    gridColumnStart: min.x + 1,
    gridColumnEnd: max.x + 2,
    gridRowStart: min.y + 1,
    gridRowEnd: max.y + 2,
  };
  return <div className="bg-white opacity-25" style={style}></div>;
};

export default SelectBox;
