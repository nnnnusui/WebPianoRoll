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

type PointerActionConfigParameter = {
  unique: boolean;
  overwrites: PointerActionType[];
  premise: number;
  residue: PointerActionType;
};
type PointerActionConfig = Map<PointerActionType, PointerActionConfigParameter>;
type PointerActionConfigOverride = Map<
  PointerActionType,
  Partial<PointerActionConfigParameter>
>;
const pointerActionConfig: PointerActionConfig = new Map([
  ["move", { unique: true, overwrites: [], premise: 0, residue: "" }],
  [
    "scale",
    { unique: true, overwrites: ["move"], premise: 1, residue: "move" },
  ],
]);
const pointerActionConfigValues = Array.from(pointerActionConfig).sort(
  ([, { premise }]) => -premise
);

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
  const set = (state: State, info: PointerInfo) =>
    state.set(info.event.pointerId, info);

  const filterByActionTypes = (from: State, by: string[]) =>
    Array.from(from).filter(([, { actionType: it }]) => by.includes(it));
  const checkQuantity = (
    from: State,
    by: string[],
    check: (quantity: number) => boolean
  ) => check(filterByActionTypes(from, by).length);
  const needsQuantity = (actionTypes: string[], needs: number) => (
    state: State
  ) => checkQuantity(state, actionTypes, (it) => it >= needs);
  const checkUnique = (actionType: string) => (state: State) =>
    checkQuantity(state, [actionType], (it) => it == 0);

  const getActionType = (state: State) => {
    return pointerActionConfigValues.find(
      ([actionType, { unique, overwrites, premise }]) => {
        const uniqueCheckResult = unique
          ? checkUnique(actionType)(state)
          : true;
        if (!uniqueCheckResult) return false;
        return needsQuantity(overwrites, premise)(state);
      }
    )?.[0];
  };

  const over = () => {};
  const enter = () => {};
  const down = (event: Event) => {
    updatePointerMap((state) => {
      const actionType = getActionType(state);
      if (!actionType) return;
      const action = actionMap.get(actionType);
      if (!action) return;
      const config = pointerActionConfig.get(actionType);
      if (!config) return;

      const overwriteTargets = filterByActionTypes(
        state,
        config.overwrites
      ).slice(-config.premise);
      overwriteTargets.forEach(([id, prev]) => {
        state.set(id, { ...prev, actionType });
        const config = pointerActionConfig.get(prev.actionType);
        if (!config) return;
        const action = actionMap.get(prev.actionType);
        if (!action) return;
        action.cancel([prev.event]);
      });
      const overwritedEvents = overwriteTargets.map(([, { event }]) => event);
      const events = [event, ...overwritedEvents.reverse()];
      action.down(events);
      set(state, { event, actionType });
    });
  };
  const move = (event: Event) => {
    updatePointerMap((state) => {
      const current = state.get(event.pointerId);
      if (!current) return;
      const actionType = current.actionType;
      const action = actionMap.get(actionType);
      if (!action) return;

      const events = [
        event,
        ...filterByActionTypes(state, [actionType])
          .filter(([id]) => id != event.pointerId)
          .map(([, { event }]) => event)
          .reverse(),
      ];
      action.move(events);
      set(state, { ...current, event });
    });
  };
  const up = (event: Event) => {
    updatePointerMap((state) => {
      const current = state.get(event.pointerId);
      if (!current) return;
      const actionType = current.actionType;
      const action = actionMap.get(actionType);
      if (!action) return;
      const config = pointerActionConfig.get(actionType);
      if (!config) return;

      const events = [
        event,
        ...filterByActionTypes(state, [actionType])
          .map(([, { event }]) => event)
          .reverse(),
      ];
      action.up(events);
      state.delete(event.pointerId);

      const residueConfig = pointerActionConfig.get(actionType);
      if (!residueConfig) return;
      const residues = filterByActionTypes(state, [actionType]).slice(
        -config.premise
      );
      if (residues.length <= 0) return;
      residues.forEach(([id, current]) =>
        state.set(id, { ...current, actionType: config.residue })
      );
      const residueAction = actionMap.get(config.residue);
      if (!residueAction) return;
      const residueEvents = residues.map(([, { event }]) => event).reverse();
      residueAction.down(residueEvents);
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
