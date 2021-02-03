import { Pos } from "../type/Pos";
import { useState } from "react";

const MoveController = (max: Pos, scale: number) => {
  const [onMove, setOnMove] = useState(false);
  const [from, setFrom] = useState({ x: 0, y: 0 });
  const [move, setMove] = useState({ x: 0, y: 0 });

  const border = {
    start: { x: 0, y: 0 },
    end: { x: max.x, y: max.y },
  };
  const fixEndExceeded = (pos: Pos, scale: number) => ({
    x: Math.min(border.end.x * scale, pos.x + max.x) - max.x,
    y: Math.min(border.end.y * scale, pos.y + max.y) - max.y,
  });
  const fixStartExceeded = (pos: Pos) => ({
    x: Math.max(border.start.x, pos.x),
    y: Math.max(border.start.y, pos.y),
  });

  const updateMoveState = (
    func: (prev: Pos) => { pos: Pos; scale: number }
  ) => {
    setMove((prev) => {
      const { pos: next, scale } = func(prev);
      return fixStartExceeded(fixEndExceeded(next, scale));
    });
  };

  const moveStart = (viewLocal: Pos) => {
    const global = {
      x: viewLocal.x + move.x,
      y: viewLocal.y + move.y,
    };
    setFrom(global);
    setOnMove(true);
  };
  const moveIn = (pos: Pos) => {
    if (!onMove) return;
    const vector = {
      x: from.x - pos.x,
      y: from.y - pos.y,
    };
    updateMoveState(() => ({ pos: vector, scale }));
  };
  const moveEnd = () => {
    setFrom({ x: 0, y: 0 });
    setOnMove(false);
  };
  return {
    get: move,
    set: updateMoveState,
    start: moveStart,
    middle: moveIn,
    end: moveEnd,
  };
};
export default MoveController;
