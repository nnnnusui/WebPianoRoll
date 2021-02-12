import { useState } from "react";

type Event = React.PointerEvent;

type PointerActionType = string;
type PointerAction = {
  down: (events: Event[]) => void;
  move: (events: Event[]) => void;
  up: (events: Event[]) => void;
  cancel: (events: Event[]) => void;
};
type PointerActionMap = Map<PointerActionType, PointerAction>;
type PointerActionOverride = Partial<PointerAction>;
type PointerActionOverrideMap = Map<PointerActionType, PointerActionOverride>;

type PointerId = number;
type PointerInfo = {
  event: Event;
  actionType: PointerActionType;
};
type State = Map<PointerId, PointerInfo>;

const PointerActionConsumer = (actionMapOverride: PointerActionOverrideMap) => {
  const actionMap: PointerActionMap = new Map(
    Array.from(actionMapOverride).map<[PointerActionType, PointerAction]>(
      ([key, value]) => [
        key,
        {
          down: value.down || (() => {}),
          move: value.move || (() => {}),
          up: value.up || (() => {}),
          cancel: value.cancel || value.up || (() => {}),
        },
      ]
    )
  );
  const [pointerMap, setPointerMap] = useState<State>(new Map());
  const getEventsByActionType = (
    from: State,
    by: PointerActionType,
    latest: Event
  ) => [
    latest,
    ...Array.from(from)
      .filter(([, { actionType }]) => actionType == by)
      .filter(([key]) => key != latest.pointerId)
      .map(([, { event }]) => event)
      .reverse(),
  ];

  const over = () => {};
  const enter = () => {};
  const down = (event: Event) => {
    const currentId = event.pointerId;
    setPointerMap((prev) => {
      const next = new Map(prev);

      const actionType = "move";
      const action = actionMap.get(actionType);
      if (action) {
        const events = getEventsByActionType(next, actionType, event);
        action.down(events);
      }

      next.set(currentId, { event, actionType });
      return next;
    });
  };
  const move = (event: Event) => {
    const currentId = event.pointerId;
    setPointerMap((prev) => {
      const current = prev.get(currentId);
      if (!current) return prev;
      const next = new Map(prev);

      const action = actionMap.get(current.actionType);
      if (action) {
        const events = getEventsByActionType(next, current.actionType, event);
        action.move(events);
      }

      next.set(currentId, { ...current, event });
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
      if (action) {
        const events = getEventsByActionType(next, current.actionType, event);
        action.up(events);
      }

      next.delete(currentId);
      return next;
    });
  };
  const cancel = up;
  const out = up;
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
export type {
  PointerActionOverrideMap,
  PointerActionType,
  PointerActionOverride,
};
