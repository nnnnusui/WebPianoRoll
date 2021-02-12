import { Pos } from "../type/Pos";
import { useState, SetStateAction } from "react";
import { Size } from "../type/Size";

const MoveState = (max: Pos, min: Pos = { x: 0, y: 0 }) => {
  const [state, setState] = useState({ x: 0, y: 0 });

  const fixEndExceeded = (pos: Pos, scale: Size) => ({
    x: Math.min(max.x * scale.width, pos.x + max.x) - max.x,
    y: Math.min(max.y * scale.height, pos.y + max.y) - max.y,
  });
  const fixStartExceeded = (pos: Pos) => ({
    x: Math.max(min.x, pos.x),
    y: Math.max(min.y, pos.y),
  });

  const updateState = (scale: Size, action: SetStateAction<Pos>) => {
    setState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      return fixStartExceeded(fixEndExceeded(next, scale));
    });
  };

  return {
    get: state,
    update: (from: Pos, to: Pos, scale: Size) => {
      const vector = {
        x: from.x - to.x,
        y: from.y - to.y,
      };
      updateState(scale, vector);
    },

    set: updateState,
    maxPos: max,
  };
};
export default MoveState;
