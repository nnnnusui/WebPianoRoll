import { useState } from "react";
import MoveController from "../controller/MoveController";
import {
  PointerActionOverride,
  PointerActionType,
} from "../PointerActionConsumer";
import { Pos } from "../type/Pos";

const MoveAction = (
  state: ReturnType<typeof MoveController>
): [PointerActionType, PointerActionOverride] => {
  type State = Map<number, Pos>;
  const [, setFromMap] = useState(new Map());
  const updateFromMap = (action: (prev: State) => void) => {
    setFromMap((prev) => {
      action(prev);
      return new Map(prev);
    });
  };
  const getViewLocal = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
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
          state.update(from, getViewLocal(current));
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
