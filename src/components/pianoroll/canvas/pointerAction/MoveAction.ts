import MoveState from "../state/MoveState";
import {
  PointerActionOverride,
  PointerActionType,
} from "../PointerActionConsumer";
import { Pos } from "../type/Pos";
import getViewLocal from "../getViewLocal";
import ScaleState from "../state/ScaleState";
import useMapState from "../useMapState";

const MoveAction = (
  state: ReturnType<typeof MoveState>,
  scale: ReturnType<typeof ScaleState>
): [PointerActionType, PointerActionOverride] => {
  type PointerId = number;
  const fromMap = useMapState<PointerId, Pos>();

  return [
    "move",
    {
      down: (events) => {
        const [event] = events;
        fromMap.update(event.pointerId, state.getGridLocal(event));
      },
      move: (events) => {
        const [current, ...others] = events;
        fromMap.set((prev) => {
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
        fromMap.remove(current.pointerId);
      },
    },
  ];
};
export default MoveAction;
