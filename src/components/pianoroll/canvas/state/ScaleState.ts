import { Pos } from "../type/Pos";
import { SetStateAction, useState } from "react";
import MoveState from "./MoveState";
import { Size } from "../type/Size";

const min = 1;
const stateInit = { width: min, height: min };
const ScaleState = (
  move: ReturnType<typeof MoveState>,
  defaultValue: Size = stateInit,
  max: number = Number.MAX_VALUE
) => {
  const maxPos = move.maxPos;
  const [state, _setState] = useState(defaultValue);
  const setState = (viewLocalFocus: Pos, action: SetStateAction<Size>) => {
    _setState((prev) => {
      const mayBeNext = typeof action === "function" ? action(prev) : action;
      const next = fixLowerLimit(fixHigherLimit(mayBeNext));

      const focus = {
        x: move.get.x + viewLocalFocus.x,
        y: move.get.y + viewLocalFocus.y,
      };
      const inGridRatio = {
        width: focus.x / (maxPos.x * prev.width),
        height: focus.y / (maxPos.y * prev.height),
      };
      const scalingVector = {
        x: (next.width - prev.width) * maxPos.x,
        y: (next.height - prev.height) * maxPos.y,
      };
      const moveVector = {
        x: inGridRatio.width * scalingVector.x,
        y: inGridRatio.height * scalingVector.y,
      };
      move.set(next, (prev) => ({
        x: prev.x + moveVector.x,
        y: prev.y + moveVector.y,
      }));

      return next;
    });
  };
  const fixLowerLimit = (target: Size) => ({
    width: Math.max(min, target.width),
    height: Math.max(min, target.height),
  });
  const fixHigherLimit = (target: Size) => ({
    width: Math.min(max, target.width),
    height: Math.min(max, target.height),
  });

  const add = (viewLocalFocus: Pos, step: Size) => {
    setState(viewLocalFocus, (prev) => ({
      width: prev.width + step.width,
      height: prev.height + step.height,
    }));
  };

  return {
    get: state,
    set: setState,
    add,
  };
};
export default ScaleState;
