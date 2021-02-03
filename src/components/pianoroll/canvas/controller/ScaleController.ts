import MoveController from "./MoveController";
import { Pos } from "../type/Pos";
import { useState } from "react";

const ScaleController = (maxPos: Pos, maxCount: number, step: number) => {
  const minCount = 0;
  const [count, setCount] = useState(minCount);
  const scale = 1 + count * step;
  const move = MoveController(maxPos, scale);
  const setScale = (scaleIn: boolean, viewLocal: Pos) => {
    const direction = scaleIn ? 1 : -1;
    setCount((prev) => {
      const next = prev + direction;
      const result = Math.max(Math.min(next, maxCount), minCount);

      const scaled = next == result;
      const ratio = {
        width: (move.get.x + viewLocal.x) / (maxPos.x * scale),
        height: (move.get.y + viewLocal.y) / (maxPos.y * scale),
      };
      const scalingVector = {
        x: step * maxPos.x,
        y: step * maxPos.y,
      };
      const moveVector = {
        x: ratio.width * scalingVector.x * direction,
        y: ratio.height * scalingVector.y * direction,
      };
      if (scaled) {
        const nextScale = 1 + result * step;
        move.set((prev) => {
          return {
            scale: nextScale,
            pos: {
              x: prev.x + moveVector.x,
              y: prev.y + moveVector.y,
            },
          };
        });
      }
      return result;
    });
  };
  return {
    set: setScale,
    get: scale,
    move: move,
  };
};
export default ScaleController;
