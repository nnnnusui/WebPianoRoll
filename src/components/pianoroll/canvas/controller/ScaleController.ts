import { Pos } from "../type/Pos";
import { useState } from "react";
import { MoveControllerType } from "./MoveController";
import { Size } from "../type/Size";

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

  const [state, setState] = useState(1);

  const fromInit = { width: 0, height: 0 };
  const [onPinch, setOnPinch] = useState(false);
  const [from, setFrom] = useState(fromInit);
  const [before, setBefore] = useState(1);
  const middlePinch = (range: Size) => {
    if (!onPinch) {
      setOnPinch(true);
      setFrom(range);
      setBefore(state);
      return;
    }
    const percentage = range.width / from.width;
    const next = before * percentage;
    setState(next);
    return `before: ${before}, next: ${next}`;
    // (`before: ${before}, next?: ${before * percentage} _ from: ${from.width}, current: ${range.width}, diff: ${difference.width}, from/current: ${from.width / range.width}`)
  };
  const endPinch = () => {
    setOnPinch(false);
    setFrom(fromInit);
    setBefore(1);
  };
  return {
    get: state,
    set: setScale,
    middlePinch,
    endPinch,
  };
};
export default ScaleController;
