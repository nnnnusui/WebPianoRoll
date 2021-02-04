import { Pos } from "../type/Pos";
import { useState } from "react";
import { MoveControllerType } from "./MoveController";

const ScaleController = (
  move: MoveControllerType,
  step: number,
  maxCount: number,
  defaultCount: number
) => {
  const maxPos = move.maxPos;
  const minCount = 0;
  const [count, setCount] = useState(defaultCount);
  const scale = 1 + count * step;
  const setScale = (scaleIn: boolean, viewLocal: Pos) => {
    const direction = scaleIn ? 1 : -1;
    setCount((prev) => {
      const next = prev + direction;
      const result = Math.max(Math.min(next, maxCount), minCount);

      const scaled = next == result;
      const focus = {
        x: move.get.x + viewLocal.x,
        y: move.get.y + viewLocal.y,
      };
      const ratio = {
        width: focus.x / (maxPos.x * scale),
        height: focus.y / (maxPos.y * scale),
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
        move.set(nextScale, (prev) => ({
          x: prev.x + moveVector.x,
          y: prev.y + moveVector.y,
        }));
      }
      return result;
    });
  };
  return {
    get: scale,
    set: setScale,
  };
};
export default ScaleController;
