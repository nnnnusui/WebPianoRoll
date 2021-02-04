import { useState } from "react";
import { Pos } from "../type/Pos";

const SelectionController = () => {
  const [on, setOn] = useState(false);
  const [from, setFrom] = useState({ x: 0, y: 0 });
  const [to, setTo] = useState({ x: 0, y: 0 });

  const start = (pos: Pos) => {
    setFrom(pos);
    setTo(pos);
    setOn(true);
  };
  const middle = (pos: Pos) => {
    if (!on) return;
    setTo(pos);
  };
  const end = () => {
    setOn(false);
  };

  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos
  ) => {
    if (!on) return;
    const rect = {
      pos: {
        x: Math.min(from.x, to.x) - move.x,
        y: Math.min(from.y, to.y) - move.y,
      },
      size: {
        width: (Math.abs(to.x - from.x) + 1),
        height: (Math.abs(to.y - from.y) + 1),
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
