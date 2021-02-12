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
    const [focus, otherSide] = events.reverse().map((it) => getViewLocal(it));
    const range = {
      width: Math.abs(otherSide.x - focus.x),
      height: Math.abs(otherSide.y - focus.y),
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
