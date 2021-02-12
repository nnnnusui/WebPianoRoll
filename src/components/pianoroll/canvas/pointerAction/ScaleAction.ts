import {
  PointerActionOverride,
  PointerActionType,
} from "../PointerActionConsumer";
import ScaleController from "../controller/ScaleController";
import getViewLocal from "../getViewLocal";

const ScaleAction = (
  state: ReturnType<typeof ScaleController>
): [PointerActionType, PointerActionOverride] => {
  const focusAndRange = (events: React.PointerEvent[]) => {
    const [onMove, focus] = events.map((it) => getViewLocal(it));
    const range = {
      width: Math.abs(onMove.x - focus.x),
      height: Math.abs(onMove.y - focus.y),
    };
    return [focus, range] as const;
  };
  return [
    "scale",
    {
      down: (events) => {
        const [, range] = focusAndRange(events);
        state.start(range);
      },
      move: (events) => {
        const [focus, range] = focusAndRange(events);
        state.middle(focus, range);
      },
      up: () => {
        state.end();
      },
    },
  ];
};
export default ScaleAction;
