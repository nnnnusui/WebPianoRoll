import { useState } from "react";

type Event = React.PointerEvent;

type PointerId = number;
type PointerInfo = {
  event: Event;
};
type State = Map<PointerId, PointerInfo>;

const PointerActionConsumer = () => {
  const [pointerMap, setPointerMap] = useState<State>(new Map());

  const over = () => {};
  const enter = () => {};
  const down = (event: Event) => {
    const currentId = event.pointerId;
    setPointerMap((prev) => {
      const next = new Map(prev);
      next.set(currentId, { event });
      return next;
    });
  };
  const move = (event: Event) => {
    const currentId = event.pointerId;
    setPointerMap((prev) => {
      const current = prev.get(currentId);
      if (!current) return prev;
      const next = new Map(prev);
      next.set(currentId, { ...current, event });
      return next;
    });
  };
  const up = (event: Event) => {
    const currentId = event.pointerId;
    setPointerMap((prev) => {
      const next = new Map(prev);
      next.delete(currentId);
      return next;
    });
  };
  const cancel = () => {};
  const out = () => {};
  const leave = () => {};

  return {
    onPointerOver: over,
    onPointerEnter: enter,
    onPointerDown: down,
    onPointerMove: move,
    onPointerUp: up,
    onPointerCancel: cancel,
    onPointerOut: out,
    onPointerLeave: leave,
    state: Array.from(pointerMap),
  };
};
export default PointerActionConsumer;
