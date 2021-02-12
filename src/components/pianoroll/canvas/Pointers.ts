import { useState } from "react";
import NotesController from "./controller/NotesController";

const types = ["", "put", "move", "scale", "select"] as const;
export type ActionType = typeof types[number];

type PointerId = number;
type PointerInfo = {
  event: React.PointerEvent;
  action: ActionType;
};
type State = Map<PointerId, PointerInfo>;

type ActionConfigParameter = {
  backward: number;
  unique: boolean;
  residue: ActionType;
  overwrites: ActionType[];
  mustBe: (events: React.PointerEvent[]) => boolean;
};
type ActionConfig = Map<ActionType, ActionConfigParameter>;
const defaultParameter: ActionConfigParameter = {
  unique: false,
  backward: 0,
  residue: "",
  overwrites: ["", "put"],
  mustBe: (events) => {
    // events
    //   .map((it) => ({ x: it.clientX, y: it.clientY }))
    //   .forEach((it) => console.log(`${it.x}, ${it.y}`));
    return true;
  },
};
const actionConfigOverride = new Map<
  ActionType,
  Partial<ActionConfigParameter>
>([
  ["", { mustBe: () => false }],
  ["put", {}],
  ["move", { unique: true }],
  ["scale", { unique: true, backward: 1, residue: "move" }],
]);
const actionConfig: ActionConfig = new Map(
  types.map((it) => [
    it,
    { ...defaultParameter, ...actionConfigOverride.get(it)! },
  ])
);

const getActionInit = (type: ActionType, events: React.PointerEvent[]) => {
  return {
    onAdd: () => {},
    onUpdate: () => {},
    onRemove: () => {},
  };
};
const Pointers = (getAction: typeof getActionInit) => {
  const [pointerMap, setPointers] = useState<State>(new Map());
  const pointers = Array.from(pointerMap);
  const actionTargetMapInit: Map<ActionType, React.PointerEvent[]> = new Map(
    types.map((it) => [it, []])
  );
  const actionTargetMap = new Map(
    pointers.reduce(
      (map, [, { action, event }]) =>
        map.set(action, [...map.get(action)!, event]),
      actionTargetMapInit
    )
  );
  const getActionTargetMap = (state: State) =>
    new Map(
      Array.from(state).reduce(
        (map, [, { action, event }]) =>
          map.set(action, [...map.get(action)!, event]),
        actionTargetMapInit
      )
    );

  const getOverwriteTargets = (type: ActionType) => {
    const config = actionConfig.get(type)!;
    return pointers.filter(([, { action: it }]) =>
      config.overwrites.includes(it)
    );
  };
  const getBackwards = (type: ActionType, backward: number) => {
    const priorityLowerPointers = getOverwriteTargets(type);
    return priorityLowerPointers.length < backward
      ? []
      : priorityLowerPointers.slice(-backward);
  };

  const trySetAction = (
    event: React.PointerEvent,
    next: State,
    type: ActionType
  ) => {
    const { backward, unique, mustBe } = actionConfig.get(type)!;
    if (unique && actionTargetMap.get(type)?.length != 0) return false;
    const events = [
      ...getBackwards(type, backward).map(([, value]) => value.event),
      event,
    ];
    if (events.length <= backward) return false;
    if (!mustBe(events)) return false;
    events.forEach((it) => // cancel
      next.set(it.pointerId, {
        action: type,
        event: next.get(it.pointerId)?.event || event,
      })
    );
    return true;
  };

  const add = (event: React.PointerEvent) => {
    const id = event.pointerId;
    setPointers((prev) => {
      const next = new Map(prev);
      Array.from(actionConfig)
        .sort(([, { backward }]) => -backward)
        .reduce((hasResult, [type, parameter]) => {
          if (hasResult) return true;
          return trySetAction(event, next, type);
        }, false);

      const action = next.get(id)?.action;
      if (action) // start
        getAction(action, getActionTargetMap(next).get(action)!).onAdd();
      return next;
    });
  };
  const update = (event: React.PointerEvent) => {
    const id = event.pointerId;
    const current = pointerMap.get(id);
    if (!current) return;
    setPointers((prev) => {
      const next = new Map(prev);
      next.set(id, { ...current, event });

      const action = current.action;
      if (action) { // middle
        const others = getActionTargetMap(next)
          .get(action)!
          .filter((it) => it.pointerId != id);
        getAction(action, [...others, event]).onUpdate();
      }
      return new Map(next);
    });
  };
  const remove = (event: React.PointerEvent) => {
    const targetId = event.pointerId;
    setPointers((prev) => {
      if (!prev.has(targetId)) return prev;
      const next = new Map(prev);
      const target = {
        ...prev.get(targetId)!,
        id: targetId,
      };
      const config = actionConfig.get(target.action)!;
      actionTargetMap
        .get(target.action)
        ?.filter((it) => it.pointerId != targetId)
        .slice(config.backward * -1)
        .forEach((it) => {
          next.set(it.pointerId, { action: config.residue, event: it });
        });
      // remove
      getAction(target.action, [target.event]).onRemove();
      getAction(config.residue, getActionTargetMap(next).get(config.residue)!);

      next.delete(targetId);
      return next;
    });
  };
  return {
    add,
    update,
    remove,
    state: pointerMap,
  };
};

export default Pointers;
