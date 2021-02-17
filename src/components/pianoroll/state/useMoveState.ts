import { Pos } from "../canvas/type/Pos";
import { useState, SetStateAction } from "react";
import { Size } from "../canvas/type/Size";
import getViewLocal from "../canvas/getViewLocal";

const min: Pos = { x: 0, y: 0 }
const useMoveState = () => {
  const [state, _setState] = useState({ x: 0, y: 0 });
  const setState = (action: SetStateAction<Pos>) => {
    _setState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      return next;
    });
  };
  const fixLowerLimit = (pos: Pos) => ({
    x: Math.max(min.x, pos.x),
    y: Math.max(min.y, pos.y),
  });
  // const fixHigherLimit = (pos: Pos, scale: Size) => ({
  //   x: Math.min(max.x * scale.width, pos.x + max.x) - max.x,
  //   y: Math.min(max.y * scale.height, pos.y + max.y) - max.y,
  // });

  const getGridLocal = (event: React.MouseEvent) => {
    const viewLocal = getViewLocal(event);
    return {
      x: state.x + viewLocal.x,
      y: state.y + viewLocal.y,
    };
  };

  return {
    get: state,
    set: setState,
    getGridLocal,
  };
};
export default useMoveState;
