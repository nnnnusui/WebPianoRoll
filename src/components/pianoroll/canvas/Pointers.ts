import { useState } from "react";

const types = [
  "",
  "put",
  "move",
  "scale",
  "select",
] as const;
type ActionType = typeof types[number];

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
  mustBe: (events: React.PointerEvent[]) => boolean;
};
type ActionConfig = Map<ActionType, ActionConfigParameter>;
const defaultParameter: ActionConfigParameter = {
  unique: false,
  backward: 0,
  residue: "",
  mustBe: (events) => {
    events.map(it=> ({x: it.clientX, y: it.clientY}))
      .forEach(it => console.log(`${it.x}, ${it.y}`))
    return true
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
  [
    "select",
    {
      backward: 1,
      residue: "select",
      mustBe: (events) => {
        const nearRange = {width: 100, height: 100}
        const [base, ...others] = events.map(it=> ({x: it.clientX, y: it.clientY}))
        const ranges = others.map(it => ({width: Math.abs(base.x - it.x), height: Math.abs(base.y - it.y)}))
        return ranges
          .filter(it => it.width > nearRange.width || it.height > nearRange.height)
          .length == 0;
      },
    },
  ],
  // ["hScale", { backward: 2, residue: "doubleTap" }],
  // ["vScale", { backward: 2, residue: "doubleTap" }],
]);
const actionConfig: ActionConfig = new Map(
  types.map((it) => [
    it,
    { ...defaultParameter, ...actionConfigOverride.get(it)! },
  ])
);

const Pointers = () => {
  const [pointerMap, setPointers] = useState<State>(new Map());
  const pointers = Array.from(pointerMap);
  const actionMapInit: Map<ActionType, React.PointerEvent[]> = new Map(
    types.map((it) => [it, []])
  );
  const actionMap = new Map(
    pointers.reduce(
      (map, [, { action, event }]) =>
        map.set(action, [...map.get(action)!, event]),
      actionMapInit
    )
  );

  const getPriorityLowers = (type: ActionType) => {
    const targetPriority = types.indexOf(type);
    return pointers.filter(
      ([, { action: it }]) => types.indexOf(it) < targetPriority
    );
  };
  const getBackwards = (type: ActionType, backward: number) => {
    const priorityLowerPointers = getPriorityLowers(type);
    return priorityLowerPointers.length < backward
      ? []
      : priorityLowerPointers.slice(-backward);
  };

  const trySetAction = (
    event: React.PointerEvent,
    next: State,
    type: ActionType,
    config: ActionConfigParameter
  ) => {
    const { backward, unique, mustBe } = config;
    if (unique && actionMap.get(type)?.length != 0) return false;
    const events = [
      ...getBackwards(type, backward).map(([, value]) => value.event),
      event,
    ];
    if (events.length <= backward) return false;
    if (!mustBe(events)) return false;
    events.forEach((it) =>
      next.set(it.pointerId, {
        action: type,
        event: next.get(it.pointerId)?.event || event,
      })
    );
    return true;
  };

  const add = (event: React.PointerEvent) => {
    setPointers((prev) => {
      const next = new Map(prev);
      Array.from(actionConfig)
        .sort(([, { backward }]) => -backward)
        .reduce((hasResult, [type, parameter]) => {
          if (hasResult) return true;
          return trySetAction(event, next, type, parameter);
        }, false);
      return next;
    });
  };
  const update = (event: React.PointerEvent) => {
    const id = event.pointerId;
  };
  const remove = (event: React.PointerEvent) => {
    const targetId = event.pointerId;
    setPointers((prev) => {
      if (!prev.has(targetId)) return prev;
      const next = new Map(prev);
      const targetAction = prev.get(targetId)!.action;
      const config = actionConfig.get(targetAction)!;
      actionMap
        .get(targetAction)
        ?.filter((it) => it.pointerId != targetId)
        .slice(config.backward * -1)
        .forEach((it) =>
          next.set(it.pointerId, { action: config.residue, event: it })
        );
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
