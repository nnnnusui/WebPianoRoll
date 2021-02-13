import { PointerActionOverride } from "../PointerActionConsumer";
import ScaleState from "../state/ScaleState";
import getViewLocal from "../getViewLocal";
import { useState } from "react";

const ScaleAction = (
  state: ReturnType<typeof ScaleState>
): PointerActionOverride => {
  const scaleInit = { width: 1, height: 1 };
  const fromInit = { scale: scaleInit, range: { width: 0, height: 0 } };
  const [from, setFrom] = useState(fromInit);

  const focusAndRange = (events: React.PointerEvent[]) => {
    const [onMove, focus] = events.map((it) => getViewLocal(it));
    const range = {
      width: Math.abs(onMove.x - focus.x),
      height: Math.abs(onMove.y - focus.y),
    };
    return [focus, range] as const;
  };

  return {
    type: "scale",
    down: (events) => {
      const [, range] = focusAndRange(events);
      setFrom({ scale: state.get, range });
    },
    move: (events) => {
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
    },
  };
};
export default ScaleAction;
