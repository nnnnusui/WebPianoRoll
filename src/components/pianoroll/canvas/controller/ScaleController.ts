import { Pos } from "../type/Pos";
import { SetStateAction, useState } from "react";
import { MoveControllerType } from "./MoveController";
import { Size } from "../type/Size";

const min = 1;
const stateInit = { width: min, height: min };
const ScaleController = (
  move: MoveControllerType,
  max: number,
  defaultValue: Size = stateInit
) => {
  const maxPos = move.maxPos;
  const [state, _setState] = useState(defaultValue);
  const setState = (viewLocalFocus: Pos, action: SetStateAction<Size>) => {
    _setState((prev) => {
      const mayBeNext = typeof action === "function" ? action(prev) : action;

      const next = fixLowerLimit(fixHigherLimit(mayBeNext));
      const widthFixed = next.width != mayBeNext.width;
      const heightFixed = next.height != mayBeNext.height;

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
        x: prev.x + (widthFixed ? 0 : moveVector.x),
        y: prev.y + (heightFixed ? 0 : moveVector.y),
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

  const rangeInit = { width: 0, height: 0 };
  const [on, setOn] = useState(false);
  const [, setBeforeRange] = useState(rangeInit);
  const byPinch = (viewLocalFocus: Pos, range: Size) => {
    if (on) middlePinch(viewLocalFocus, range);
    else startPinch(range);
  };
  const startPinch = (range: Size) => {
    setOn(true);
    setBeforeRange(range);
  };
  const middlePinch = (viewLocalFocus: Pos, range: Size) => {
    setBeforeRange((before) => {
      const sizeRatio = {
        width: range.width / before.width,
        height: range.height / before.height,
      };
      setState(viewLocalFocus, (prev) => ({
        width: prev.width * sizeRatio.width,
        height: prev.height * sizeRatio.height,
      }));
      return range;
    });
  };
  const endPinch = () => {
    setOn(false);
  };

  const add = (viewLocalFocus: Pos, step: Size) => {
    setState(viewLocalFocus, (prev) => ({
      width: prev.width + step.width,
      height: prev.height + step.height,
    }));
  };

  return {
    get: state,
    add,
    byPinch,
    endPinch,
  };
};
export default ScaleController;
