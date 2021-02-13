import { Pos } from "../type/Pos";
import { useState, SetStateAction } from "react";
import { Size } from "../type/Size";
import getViewLocal from "../getViewLocal";

const MoveState = (max: Pos, min: Pos = { x: 0, y: 0 }) => {
  const [state, _setState] = useState({ x: 0, y: 0 });
  const setState = (scale: Size, action: SetStateAction<Pos>) => {
    _setState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      return fixLowerLimit(fixHigherLimit(next, scale));
    });
  };
  const fixLowerLimit = (pos: Pos) => ({
    x: Math.max(min.x, pos.x),
    y: Math.max(min.y, pos.y),
  });
  const fixHigherLimit = (pos: Pos, scale: Size) => ({
    x: Math.min(max.x * scale.width, pos.x + max.x) - max.x,
    y: Math.min(max.y * scale.height, pos.y + max.y) - max.y,
  });

  const getGridLocal = (event: React.MouseEvent) => {
    const viewLocal = getViewLocal(event);
    return {
      x: state.x + viewLocal.x,
      y: state.y + viewLocal.y,
    };
  };

  return {
    maxPos: max,
    get: state,
    set: setState,
    getGridLocal,
  };
};
export default MoveState;
