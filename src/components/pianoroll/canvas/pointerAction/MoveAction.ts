import { useState } from "react";
import MoveState from "../state/MoveState";
import {
  PointerActionOverride,
  PointerActionType,
} from "../PointerActionConsumer";
import { Pos } from "../type/Pos";
import getViewLocal from "../getViewLocal";
import ScaleState from "../state/ScaleState";

const MoveAction = (
  state: ReturnType<typeof MoveState>,
  scale: ReturnType<typeof ScaleState>
): [PointerActionType, PointerActionOverride] => {
  type State = Map<number, Pos>;
  const [, setFromMap] = useState(new Map());
  const updateFromMap = (action: (prev: State) => void) => {
    setFromMap((prev) => {
      action(prev);
      return new Map(prev);
    });
  };

  return [
    "move",
    {
      down: (events) => {
        const [current] = events;
        updateFromMap((prev) =>
          prev.set(current.pointerId, state.getGridLocal(current))
        );
      },
      move: (events) => {
        const [current, ...others] = events;
        updateFromMap((prev) => {
          const from = prev.get(current.pointerId);
          if (!from) return;
          const to = getViewLocal(current);
          const vector = {
            x: from.x - to.x,
            y: from.y - to.y,
          };
          state.set(scale.get, vector);
          others.forEach((it) =>
            prev.set(it.pointerId, state.getGridLocal(it))
          );
        });
      },
      up: (events) => {
        const [current] = events;
        updateFromMap((prev) => prev.delete(current.pointerId));
      },
    },
  ];
};
export default MoveAction;
