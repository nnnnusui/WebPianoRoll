import { Pos } from "../type/Pos";
import { useState } from "react";
import { MoveControllerType } from "./MoveController";
import { Size } from "../type/Size";

const min = 1;
const stateInit = { width: min, height: min };
const ScaleController = (
  move: MoveControllerType,
  step: number,
  max: number,
  defaultValue: Size = stateInit
) => {
  const maxPos = move.maxPos;
  const [state, setState] = useState(defaultValue);

  const fixLowerLimit = (target: Size) => ({
    width: Math.max(min, target.width),
    height: Math.max(min, target.height),
  });
  const fixHigherLimit = (target: Size) => ({
    width: Math.min(max, target.width),
    height: Math.min(max, target.height),
  });

  const getMoveVector = (direction: number, viewLocal: Pos, state: Size) => {
    const focus = {
      x: move.get.x + viewLocal.x,
      y: move.get.y + viewLocal.y,
    };
    const ratio = {
      width: focus.x / (maxPos.x * state.width),
      height: focus.y / (maxPos.y * state.height),
    };
    const scalingVector = {
      x: step * maxPos.x,
      y: step * maxPos.y,
    };
    return {
      x: ratio.width * scalingVector.x * direction,
      y: ratio.height * scalingVector.y * direction,
    };
  };

  const setScale = (scaleIn: boolean, viewLocalFocus: Pos) => {
    const direction = scaleIn ? 1 : -1;
    setState((prev) => {
      const mayBeNext = {
        width: prev.width + step * direction,
        height: prev.height + step * direction,
      };
      const next = fixLowerLimit(fixHigherLimit(mayBeNext));

      const widthFixed = next.width != mayBeNext.width;
      const heightFixed = next.height != mayBeNext.height;
      const moveVector = getMoveVector(direction, viewLocalFocus, prev);
      move.set(next, (prev) => ({
        x: prev.x + (widthFixed ? 0 : moveVector.x),
        y: prev.y + (heightFixed ? 0 : moveVector.y),
      }));

      return next;
    });
  };

  const fromInit = { width: 0, height: 0 };
  const [onPinch, setOnPinch] = useState(false);
  const [from, setFrom] = useState(fromInit);
  const [before, setBefore] = useState(stateInit);
  const middlePinch = (range: Size) => {
    if (!onPinch) {
      setOnPinch(true);
      setFrom(range);
      setBefore(state);
      return;
    }
    const sizeRatio = {
      width: range.width / from.width,
      height: range.height / from.height,
    };
    const next = {
      width: before.width * sizeRatio.width,
      height: before.height * sizeRatio.height,
    };
    setState(next);
    return `before: ${before}, next: ${next}`;
  };
  const endPinch = () => {
    setOnPinch(false);
    setFrom(fromInit);
    setBefore(stateInit);
  };
  return {
    get: state,
    set: setScale,
    middlePinch,
    endPinch,
  };
};
export default ScaleController;
