import { Pos } from "../type/Pos";
import { useState, SetStateAction } from "react";
import getViewLocal from "../canvas/getViewLocal";
import useScaleState from "./useScaleState";
import useGridState from "./useGridState";

const min: Pos = { x: 0, y: 0 };
const useMoveState = (
  grid: ReturnType<typeof useGridState>,
  scale: ReturnType<typeof useScaleState>,
  init = min
) => {
  const [state, _setState] = useState(init);
  const setState = (action: SetStateAction<Pos>) => {
    _setState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      return fixLowerLimit(fixHigherLimit(next));
    });
  };
  const max: Pos = {
    x: grid.size.width - scale.get.width,
    y: grid.size.height - scale.get.height,
  };

  const fixLowerLimit = (pos: Pos) => ({
    x: Math.max(min.x, pos.x),
    y: Math.max(min.y, pos.y),
  });
  const fixHigherLimit = (pos: Pos) => ({
    x: Math.min(max.x, pos.x),
    y: Math.min(max.y, pos.y),
  });

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
