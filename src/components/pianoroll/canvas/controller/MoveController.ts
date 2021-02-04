import { Pos } from "../type/Pos";
import { useState, SetStateAction } from "react";

const MoveController = (max: Pos, min: Pos = { x: 0, y: 0 }) => {
  const [on, setOn] = useState(false);
  const [from, setFrom] = useState({ x: 0, y: 0 });
  const [state, setState] = useState({ x: 0, y: 0 });

  const fixEndExceeded = (pos: Pos, scale: number) => ({
    x: Math.min(max.x * scale, pos.x + max.x) - max.x,
    y: Math.min(max.y * scale, pos.y + max.y) - max.y,
  });
  const fixStartExceeded = (pos: Pos) => ({
    x: Math.max(min.x, pos.x),
    y: Math.max(min.y, pos.y),
  });

  const updateState = (scale: number, action: SetStateAction<Pos>) => {
    setState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      return fixStartExceeded(fixEndExceeded(next, scale));
    });
  };

  const start = (viewLocal: Pos) => {
    const global = {
      x: viewLocal.x + state.x,
      y: viewLocal.y + state.y,
    };
    setFrom(global);
    setOn(true);
  };
  const middle = (pos: Pos, scale: number) => {
    if (!on) return;
    const vector = {
      x: from.x - pos.x,
      y: from.y - pos.y,
    };
    updateState(scale, vector);
  };
  const end = () => {
    setFrom({ x: 0, y: 0 });
    setOn(false);
  };
  return {
    get: state,
    set: updateState,
    start,
    middle,
    end,

    maxPos: max,
  };
};
export default MoveController;

type MoveControllerType = ReturnType<typeof MoveController>;
export type { MoveControllerType };
