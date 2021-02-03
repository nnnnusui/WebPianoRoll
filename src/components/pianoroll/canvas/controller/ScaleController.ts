import MoveController from "./MoveController";
import { Pos } from "../type/Pos";
import { useState } from "react";

const ScaleController = (maxPos: Pos, maxCount: number, step: number) => {
  const [scaleCount, setScaleCount] = useState(0);
  const scale = 1 + scaleCount * step;
  const move = MoveController(maxPos, scale);
  const setScale = (scaleIn: boolean, viewLocal: Pos) => {
    const direction = scaleIn ? 1 : -1;
    setScaleCount((prev) => {
      const next = prev + direction;
      const result = scaleIn ? (next > 10 ? 10 : next) : next < 0 ? 0 : next;

      const scaled = next == result;
      const mouse = viewLocal;
      const ratio = {
        width: (move.state.x + mouse.x) / (maxPos.x * scale),
        height: (move.state.y + mouse.y) / (maxPos.y * scale),
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
        move.setState((prev) => {
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
    state: scale,
    move: move,
  };
};
export default ScaleController;
