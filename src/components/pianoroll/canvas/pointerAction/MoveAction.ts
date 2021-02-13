import MoveState from "../state/MoveState";
import {
  PointerActionOverride,
  PointerActionType,
} from "../PointerActionConsumer";
import { Pos } from "../type/Pos";
import getViewLocal from "../getViewLocal";
import ScaleState from "../state/ScaleState";
import useMapState from "../useMapState";
import PointerId from "../type/PointerId";

const MoveAction = (
  state: ReturnType<typeof MoveState>,
  scale: ReturnType<typeof ScaleState>
): [PointerActionType, PointerActionOverride] => {
  const fromMap = useMapState<PointerId, Pos>();

  return [
    "move",
    {
      down: (events) => {
        const [event] = events;
        fromMap.set(event.pointerId, state.getGridLocal(event));
      },
      move: (events) => {
        const [current, ...others] = events;
        fromMap.use((prev) => {
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
        fromMap.delete(current.pointerId);
      },
    },
  ];
};
export default MoveAction;
