import { SetStateAction, useState } from "react";
import { Size } from "../canvas/type/Size";
import useMoveState from "./useMoveState";
import useGridState from "./useGridState";
import { Pos } from "../canvas/type/Pos";

const min = { width: 1, height: 1 };
const useScaleState = (
  grid: ReturnType<typeof useGridState>,
  move: ReturnType<typeof useMoveState>,
  defaultValue: Size
) => {
  const max = grid.size;
  // const maxPos = move.maxPos;
  const [state, _setState] = useState(defaultValue);
  const setState = (action: SetStateAction<Size>) => {
    _setState((prevScale) => {
      const mayBeNext =
        typeof action === "function" ? action(prevScale) : action;
      const next = fixLowerLimit(fixHigherLimit(mayBeNext));

      if (!focus) return next;
      // move.set((prevMove) => {
      //   // find `moveVector` calculation. and apply to MoveState.
      //   const focus = {
      //     x: prevMove.x + viewLocalFocus.x,
      //     y: prevMove.y + viewLocalFocus.y,
      //   };
      //   const inGridRatio = {
      //     width: focus.x / (maxPos.x * prevScale.width),
      //     height: focus.y / (maxPos.y * prevScale.height),
      //   };
      //   const scalingVector = {
      //     x: (next.width - prevScale.width) * maxPos.x,
      //     y: (next.height - prevScale.height) * maxPos.y,
      //   };
      //   const moveVector = {
      //     x: inGridRatio.width * scalingVector.x,
      //     y: inGridRatio.height * scalingVector.y,
      //   };
      //   return {
      //     x: prevMove.x + moveVector.x,
      //     y: prevMove.y + moveVector.y,
      //   };
      // });

      return next;
    });
  };
  const fixLowerLimit = (target: Size) => ({
    width: Math.max(min.width, target.width),
    height: Math.max(min.height, target.height),
  });
  const fixHigherLimit = (target: Size) => ({
    width: Math.min(max.width, target.width),
    height: Math.min(max.height, target.height),
  });

  // const add = (viewLocalFocus: Pos, step: Size) => {
  //   setState(viewLocalFocus, (prev) => ({
  //     width: prev.width + step.width,
  //     height: prev.height + step.height,
  //   }));
  // };

  return {
    get: state,
    set: setState,
    // add,
  };
};
export default useScaleState;
