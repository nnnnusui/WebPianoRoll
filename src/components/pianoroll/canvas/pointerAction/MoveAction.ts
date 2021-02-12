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
  const getGridLocal = (event: React.MouseEvent) => {
    const viewLocal = getViewLocal(event);
    return {
      x: state.get.x + viewLocal.x,
      y: state.get.y + viewLocal.y,
    };
  };

  return [
    "move",
    {
      down: (events) => {
        const [current] = events;
        updateFromMap((prev) =>
          prev.set(current.pointerId, getGridLocal(current))
        );
      },
      move: (events) => {
        const [current, ...others] = events;
        updateFromMap((prev) => {
          const from = prev.get(current.pointerId);
          if (!from) return;
          state.update(from, getViewLocal(current), scale.get);
          others.forEach((it) => prev.set(it.pointerId, getGridLocal(it)));
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
