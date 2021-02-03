import React from "react";

type Props = {
  selection: Selection;
  cellSize: Size;
};
const Select: React.FC<Props> = ({ selection, cellSize }) => {
  const start = {
    x: Math.min(selection.from.x, selection.to.x),
    y: Math.min(selection.from.y, selection.to.y),
  };
  const range = {
    width: Math.abs(selection.from.x - selection.to.x) + 1,
    height: Math.abs(selection.from.y - selection.to.y) + 1,
  };
  const rect = {
    pos: {
      x: start.x * cellSize.width,
      y: start.y * cellSize.height,
    },
    size: {
      width: range.width * cellSize.width,
      height: range.height * cellSize.height,
    },
  };
  const style = styleFromRect(rect);

  return (
    <div {...{ style }} className="pointer-events-none absolute bg-black" />
  );
};
export default Select;

const styleFromRect = (rect: Rect) => ({
  top: rect.pos.y,
  left: rect.pos.x,
  width: rect.size.width,
  height: rect.size.height,
});
export type Selection = {
  from: Pos;
  to: Pos;
};

type Size = {
  width: number;
  height: number;
};
type Pos = {
  x: number;
  y: number;
};
type Rect = {
  pos: Pos;
  size: Size;
};
