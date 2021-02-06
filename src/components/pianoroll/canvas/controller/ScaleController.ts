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

  const fromInit = { scale: stateInit, range: { width: 0, height: 0 } };
  const [on, setOn] = useState(false);
  const [from, setFrom] = useState(fromInit);
  const byPinch = (viewLocalFocus: Pos, range: Size) => {
    if (on) middlePinch(viewLocalFocus, range);
    else startPinch(range);
  };
  const startPinch = (range: Size) => {
    setOn(true);
    setFrom({ scale: state, range });
  };
  const middlePinch = (viewLocalFocus: Pos, range: Size) => {
    if (range.width == 0 || range.height == 0) return;
    const sizeRatio = {
      width: range.width / from.range.width,
      height: range.height / from.range.height,
    };
    setState(viewLocalFocus, {
      width: from.scale.width * sizeRatio.width,
      height: from.scale.height * sizeRatio.height,
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
