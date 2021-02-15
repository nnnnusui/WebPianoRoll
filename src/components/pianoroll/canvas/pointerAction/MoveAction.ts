import MoveState from "../state/MoveState";
import getViewLocal from "../getViewLocal";
import ScaleState from "../state/ScaleState";
import { PointerActionExecutorOverride } from "../../../pointerAction/Executor";
import Event from "../../../pointerAction/type/Event";

const MoveAction = (
  state: ReturnType<typeof MoveState>,
  scale: ReturnType<typeof ScaleState>
): PointerActionExecutorOverride => {
  return {
    type: "move",
    executor: (events) => {
      const [event] = events;
      const from = state.getGridLocal(event);
      const execute = (events: Event[]) => {
        const [event, ...others] = events;
        const to = getViewLocal(event);
        const vector = {
          x: from.x - to.x,
          y: from.y - to.y,
        };
        state.set(scale.get, vector);
      };
      return { execute, mayBeExecute: execute };
    },
  };
};
export default MoveAction;
