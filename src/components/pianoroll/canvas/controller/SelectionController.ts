import { useState } from "react";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";

const SelectionController = () => {
  const [on, setOn] = useState(false);
  const [from, setFrom] = useState({ x: 0, y: 0 });
  const [to, setTo] = useState({ x: 0, y: 0 });

  const start = (cell: Pos) => {
    setFrom(cell);
    setTo(cell);
    setOn(true);
  };
  const middle = (cell: Pos) => {
    if (!on) return;
    setTo(cell);
  };
  const end = () => {
    setOn(false);
  };

  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    if (!on) return;
    const rect = {
      pos: {
        x: Math.min(from.x, to.x) * cellSize.width - move.x,
        y: Math.min(from.y, to.y) * cellSize.height - move.y,
      },
      size: {
        width: (Math.abs(to.x - from.x) + 1) * cellSize.width,
        height: (Math.abs(to.y - from.y) + 1) * cellSize.height,
      },
    };
    context.fillRect(rect.pos.x, rect.pos.y, rect.size.width, rect.size.height);
  };

  return {
    get: { from, to },
    start,
    middle,
    end,
    draw,
  };
};
export default SelectionController;
