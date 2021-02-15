import ScaleState from "../state/ScaleState";
import getViewLocal from "../getViewLocal";
import { PointerActionExecutorOverride } from "../../../pointerAction/Executor";
import Event from "../../../pointerAction/type/Event";

const ScaleAction = (
  state: ReturnType<typeof ScaleState>
): PointerActionExecutorOverride => {
  const focusAndRange = (events: Event[]) => {
    const [onMove, focus] = events.map((it) => getViewLocal(it));
    const range = {
      width: Math.abs(onMove.x - focus.x),
      height: Math.abs(onMove.y - focus.y),
    };
    return [focus, range] as const;
  };

  return {
    type: "scale",
    executor: (events) => {
      const [, range] = focusAndRange(events);
      const from = { scale: state.get, range };

      const execute = (events: Event[]) => {
        const [focus, range] = focusAndRange(events);
        if (range.width == 0 || range.height == 0) return;
        const sizeRatio = {
          width: range.width / from.range.width,
          height: range.height / from.range.height,
        };
        state.set(focus, {
          width: from.scale.width * sizeRatio.width,
          height: from.scale.height * sizeRatio.height,
        });
      };
      return { execute: () => {}, mayBeExecute: execute };
    },
  };
};
export default ScaleAction;
