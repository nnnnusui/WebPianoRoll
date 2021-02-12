import { useState } from "react";

type Event = React.PointerEvent;

type PointerActionType = string;
type PointerAction = {
  down: (event: Event) => void;
  move: (event: Event) => void;
  up: (event: Event) => void;
};
type PointerActionMap = Map<PointerActionType, PointerAction>;

type PointerId = number;
type PointerInfo = {
  event: Event;
  actionType: PointerActionType;
};
type State = Map<PointerId, PointerInfo>;

const PointerActionConsumer = (actionMap: PointerActionMap) => {
  const [pointerMap, setPointerMap] = useState<State>(new Map());

  const over = () => {};
  const enter = () => {};
  const down = (event: Event) => {
    const currentId = event.pointerId;
    setPointerMap((prev) => {
      const next = new Map(prev);

      const actionType = "move";
      next.set(currentId, { event, actionType });

      const action = actionMap.get(actionType);
      if (action) action.down(event);
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

      const action = actionMap.get(current.actionType);
      if (action) action.move(event);
      return next;
    });
  };
  const up = (event: Event) => {
    const currentId = event.pointerId;
    setPointerMap((prev) => {
      const current = prev.get(currentId);
      if (!current) return prev;
      const next = new Map(prev);

      const action = actionMap.get(current.actionType);
      if (action) action.up(event);

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
export type { PointerActionMap, PointerActionType, PointerAction };
