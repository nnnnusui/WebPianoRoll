import { useState } from "react";
import PointerActionConfig, {
  PointerActionConfigParameter,
} from "./PointerActionConfig";
import PointerId from "./type/PointerId";
import useMapState from "./useMapState";

type Event = React.PointerEvent;

type PointerActionType = string;
type PointerAction = {
  down: (events: Event[]) => void;
  move: (events: Event[]) => void;
  up: (events: Event[]) => void;
  cancel: (events: Event[]) => void;
  draw: (context: CanvasRenderingContext2D) => void;
};
type PointerActionMap = Map<PointerActionType, PointerAction>;
type PointerActionOverride = {
  type: PointerActionType;
} & Partial<PointerAction>;

type PointerInfo = {
  event: Event;
  actionType: PointerActionType;
};
type State = Map<PointerId, PointerInfo>;

const PointerActionConsumer = (
  pointerActionConfig: PointerActionConfig,
  actionMapOverride: PointerActionOverride[]
) => {
  const pointerActionConfigValues = Array.from(pointerActionConfig)
    .reverse()
    .sort(([, { premise }]) => -premise);
  const actionMap: PointerActionMap = new Map(
    actionMapOverride.map<[PointerActionType, PointerAction]>((it) => [
      it.type,
      {
        down: it.down || (() => {}),
        move: it.move || (() => {}),
        up: it.up || (() => {}),
        cancel: it.cancel || it.up || (() => {}),
        draw: it.draw || (() => {}),
      },
    ])
  );
  const pointerMap = useMapState<PointerId, PointerInfo>();

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

  const checkConfigParameters = (
    state: State,
    actionType: PointerActionType,
    parameter: PointerActionConfigParameter
  ) => {
    const { unique, overwrites, premise } = parameter;
    const uniqueCheckResult = unique ? checkUnique(actionType)(state) : true;
    if (!uniqueCheckResult) return false;
    return needsQuantity(overwrites, premise)(state);
  };
  const getActionType = (state: State) => {
    return pointerActionConfigValues.find(([actionType, parameter]) =>
      checkConfigParameters(state, actionType, parameter)
    )?.[0];
  };

  const over = () => {};
  const enter = () => {};
  const down = (event: Event) => {
    pointerMap.use((state) => {
      const actionType = getActionType(state);
      if (!actionType) return;
      state.set(event.pointerId, { event, actionType });
    });
    // updatePointerMap((state) => {
    //   const actionType = getActionType(state);
    //   if (!actionType) return;
    //   const config = pointerActionConfig.get(actionType);
    //   if (!config) return;

    //   const overwriteTargets = filterByActionTypes(
    //     state,
    //     config.overwrites
    //   ).slice(-config.premise);
    //   overwriteTargets.forEach(([id, prev]) => {
    //     state.set(id, { ...prev, actionType });
    //     const config = pointerActionConfig.get(prev.actionType);
    //     if (!config) return;
    //     const action = actionMap.get(prev.actionType);
    //     if (!action) return;
    //     action.cancel([prev.event]);
    //   });
    //   const overwritedEvents = overwriteTargets.map(([, { event }]) => event);
    //   const events = [event, ...overwritedEvents.reverse()];

    //   const action = actionMap.get(actionType);
    //   if (action) action.down(events);

    //   set(state, { event, actionType });
    // });
  };
  const move = (event: Event) => {
    pointerMap.set(event.pointerId, (prev) => {
      if (!prev) return;
      return { ...prev, event: event };
    });
    // updatePointerMap((state) => {
    //   const current = state.get(event.pointerId);
    //   if (!current) return;
    //   const actionType = current.actionType;
    //   const events = [
    //     event,
    //     ...filterByActionTypes(state, [actionType])
    //       .filter(([id]) => id != event.pointerId)
    //       .map(([, { event }]) => event)
    //       .reverse(),
    //   ];
    //   const action = actionMap.get(actionType);
    //   if (action) action.move(events);
    //   set(state, { ...current, event });
    // });
  };
  const up = (event: Event) => {
    pointerMap.delete(event.pointerId);
    // updatePointerMap((state) => {
    //   const current = state.get(event.pointerId);
    //   if (!current) return;
    //   const actionType = current.actionType;
    //   const config = pointerActionConfig.get(actionType);
    //   if (!config) return;

    //   const events = [
    //     event,
    //     ...filterByActionTypes(state, [actionType])
    //       .map(([, { event }]) => event)
    //       .reverse(),
    //   ];

    //   const action = actionMap.get(actionType);
    //   if (action) action.up(events);

    //   state.delete(event.pointerId);

    //   const residues = filterByActionTypes(state, [actionType]).slice(
    //     -config.premise
    //   );
    //   if (residues.length <= 0) return;
    //   const residueConfig = pointerActionConfig.get(config.residue);
    //   if (!residueConfig) return;
    //   const setAllowed = checkConfigParameters(
    //     state,
    //     config.residue,
    //     residueConfig
    //   );
    //   residues.forEach(([id, current]) => {
    //     if (setAllowed)
    //       state.set(id, { ...current, actionType: config.residue });
    //     else state.delete(id);
    //   });
    //   const residueAction = actionMap.get(config.residue);
    //   if (!residueAction) return;
    //   const residueEvents = residues.map(([, { event }]) => event).reverse();
    //   residueAction.down(residueEvents);
    // });
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
    state: Array.from(pointerMap.state),
  };
};
export default PointerActionConsumer;
export type { PointerActionType, PointerActionOverride };
