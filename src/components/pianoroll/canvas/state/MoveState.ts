import { Pos } from "../type/Pos";
import { useState, SetStateAction } from "react";
import { Size } from "../type/Size";

const MoveState = (max: Pos, min: Pos = { x: 0, y: 0 }) => {
  const [on, setOn] = useState(false);
  const [from, setFrom] = useState({ x: 0, y: 0 });
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

  const start = (viewLocal: Pos) => {
    const global = {
      x: viewLocal.x + state.x,
      y: viewLocal.y + state.y,
    };
    setFrom(global);
    setOn(true);
  };
  const middle = (viewLocal: Pos, scale: Size) => {
    if (!on) return;
    const vector = {
      x: from.x - viewLocal.x,
      y: from.y - viewLocal.y,
    };
    updateState(scale, vector);
  };
  const end = () => {
    setFrom({ x: 0, y: 0 });
    setOn(false);
  };
  return {
    get: state,
    update: (from: Pos, to: Pos) => {
      const vector = {
        x: from.x - to.x,
        y: from.y - to.y,
      };
      setState(vector);
    },
    set: updateState,
    start,
    middle,
    end,

    maxPos: max,
  };
};
export default MoveState;
