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

const Conditions = (() => {
  const filterByActionTypes = (actionTypes: string[]) => (state: State) =>
    Array.from(state).filter(([, { actionType: it }]) =>
      actionTypes.includes(it)
    );
  const checkQuantity = (
    actionTypes: string[],
    check: (quantity: number) => boolean
  ) => (state: State) => check(filterByActionTypes(actionTypes)(state).length);

  return {
    unique: (actionType: string) =>
      checkQuantity([actionType], (it) => it == 0),
    needsQuantity: (actionTypes: string[], needs: number) =>
      checkQuantity(actionTypes, (it) => it >= needs),
  };
})();
const config = new Map<string, ((state: State) => boolean)[]>([
  ["move", []],
  [
    "scale",
    [Conditions.unique("scale"), Conditions.needsQuantity(["move"], 1)],
  ],
]);
const configValues = Array.from(config)
  .sort(([, value]) => -value.length)
  .map(([actionType, conditions]) => ({ actionType, conditions }));
// .reduce((map, [key, value]) => map.set(value.length, [...map.get(value.length) || [], { actionType: key, conditions: value }]), new Map<number, { actionType: string, conditions: ((state: State) => boolean)[] }[]>())

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
  const updatePointerMap = (action: (state: State) => void) => {
    setPointerMap((prev) => {
      const next = new Map(prev);
      action(next);
      return next;
    });
  };

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
    updatePointerMap((state) => {
      const actionType = configValues.find(
        ({ conditions }) => conditions.filter((it) => !it(state)).length == 0
      )?.actionType;
      if (!actionType) return;

      const action = actionMap.get(actionType);
      if (action) {
        const events = getEventsByActionType(state, actionType, event);
        // action.down(events);
      }

      state.set(currentId, { event, actionType });
    });
  };
  const move = (event: Event) => {
    const currentId = event.pointerId;
    updatePointerMap((state) => {
      const current = state.get(currentId);
      if (!current) return;

      const action = actionMap.get(current.actionType);
      if (action) {
        const events = getEventsByActionType(state, current.actionType, event);
        // action.move(events);
      }

      state.set(currentId, { ...current, event });
    });
  };
  const up = (event: Event) => {
    const currentId = event.pointerId;
    updatePointerMap((state) => {
      const current = state.get(currentId);
      if (!current) return;

      const action = actionMap.get(current.actionType);
      if (action) {
        const events = getEventsByActionType(state, current.actionType, event);
        action.up(events);
      }

      state.delete(currentId);
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
