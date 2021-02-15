import { PointerActionExecutorMap } from "./Executor";
import PointerActionSettings, { PointerActionConditions } from "./Settings";
import PointerActionState from "./State";
import ActionType from "./type/ActionType";
import Event from "./type/Event";
import PointerId from "../pianoroll/canvas/type/PointerId";

const Distributor = (
  state: ReturnType<typeof PointerActionState>,
  settings: ReturnType<typeof PointerActionSettings>,
  executorMap: PointerActionExecutorMap
) => {
  const filteredByActionTypes = (by: ActionType[], pointerId: PointerId) =>
    Array.from(state.state)
      .filter(([id]) => pointerId != id)
      .filter(([, { action: { type } }]) => by.includes(type));

  const isUnique = (it: ActionType) =>
    Array.from(state.state.values())
      .map(({ action: { type } }) => type)
      .includes(it);
  const checkConditions = (
    type: ActionType,
    conditions: PointerActionConditions,
    pointerId: PointerId
  ) => {
    const { unique, overwrites, premise } = conditions;
    if (unique && isUnique(type)) return;
    const mayBeOverwrites = filteredByActionTypes(overwrites, pointerId);
    if (mayBeOverwrites.length < premise) return;
    const overwriteTargets = mayBeOverwrites.slice(-premise);
    return { type, conditions, overwriteTargets };
  };

  const findAction = (pointerId: PointerId) =>
    Array.from(settings)
      .reverse()
      .map(([type, conditions]) => checkConditions(type, conditions, pointerId))
      .find((it) => !!it);

  const getEvents = (
    latest: Event,
    from: ReturnType<typeof filteredByActionTypes>
  ) => [
    latest,
    ...from
      .map(([, { event }]) => {
        console.log(event.pointerId);
        return event;
      })
      .filter((it) => it.pointerId != latest.pointerId)
      .reverse(),
  ];

  const applyResidue = (
    state: PointerActionState,
    from: ReturnType<typeof state.get>
  ) => {
    if (!from) return;
    const pointerId = from.event.pointerId;
    const before = from.action.type;
    const { residue, premise } = from.action.conditions;
    const conditions = settings.get(residue);
    if (!conditions) return;
    const targets = filteredByActionTypes([before], pointerId)
      .slice(-premise)
      .reverse();
    const residual = !!checkConditions(residue, conditions, pointerId);

    targets.forEach(([id, it]) => {
      if (residual) {
        const events = targets.map(([, { event }]) => event).reverse();
        const executor = executorMap.use(residue, events);
        state.set(id, {
          ...it,
          action: { ...it.action, type: residue, executor },
        });
      } else state.delete(id);
    });
  };

  return {
    listeners: {
      onPointerOver: () => {},
      onPointerEnter: () => {},
      onPointerDown: (event: Event) => {
        const finded = findAction(event.pointerId);
        if (!finded) return;
        const events = getEvents(event, finded.overwriteTargets);
        const action = {
          ...finded,
          executor: executorMap.use(finded.type, events),
        };
        finded.overwriteTargets.forEach(([id, prev]) =>
          state.set(id, { ...prev, action })
        );
        state.set(event.pointerId, { event, action });
      },
      onPointerMove: (event: Event) => {
        state.use((state) => {
          const prev = state.get(event.pointerId);
          if (!prev) return;
          const next = { ...prev, event };
          const events = getEvents(
            event,
            filteredByActionTypes([next.action.type], event.pointerId)
          );
          next.action.executor.mayBeExecute(events);
          state.set(event.pointerId, next);
        });
      },
      onPointerUp: (event: Event) =>
        state.use((state) => {
          const prev = state.get(event.pointerId);
          if (!prev) return;
          const next = { ...prev, event };
          const events = getEvents(
            next.event,
            filteredByActionTypes([next.action.type], event.pointerId)
          );
          next.action.executor.execute(events);
          applyResidue(state, next);
          state.delete(event.pointerId);
        }),
      onPointerCancel: (event: Event) =>
        state.use((state) => {
          const prev = state.get(event.pointerId);
          if (!prev) return;
          const next = { ...prev, event };
          applyResidue(state, next);
          state.delete(event.pointerId);
        }),
      onPointerOut: () => {},
      onPointerLeave: () => {},
    },
  };
};
const PointerActionDistributor = Distributor;
export default PointerActionDistributor;
