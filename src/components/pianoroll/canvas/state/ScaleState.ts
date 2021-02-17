import { Pos } from "../type/Pos";
import { SetStateAction, useState } from "react";
import MoveState from "../../state/MoveState";
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
    _setState((prevScale) => {
      const mayBeNext =
        typeof action === "function" ? action(prevScale) : action;
      const next = fixLowerLimit(fixHigherLimit(mayBeNext));

      move.set(next, (prevMove) => {
        // find `moveVector` calculation. and apply to MoveState.
        const focus = {
          x: prevMove.x + viewLocalFocus.x,
          y: prevMove.y + viewLocalFocus.y,
        };
        const inGridRatio = {
          width: focus.x / (maxPos.x * prevScale.width),
          height: focus.y / (maxPos.y * prevScale.height),
        };
        const scalingVector = {
          x: (next.width - prevScale.width) * maxPos.x,
          y: (next.height - prevScale.height) * maxPos.y,
        };
        const moveVector = {
          x: inGridRatio.width * scalingVector.x,
          y: inGridRatio.height * scalingVector.y,
        };
        return {
          x: prevMove.x + moveVector.x,
          y: prevMove.y + moveVector.y,
        };
      });

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
