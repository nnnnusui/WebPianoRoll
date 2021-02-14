import PointerActionExecutor, { PointerActionExecutorMap } from "./Executor";
import PointerActionSettings, { PointerActionConditions } from "./Settings";
import PointerActionState from "./State";
import ActionType from "./type/ActionType";
import Event from "./type/Event";

const Distributor = (
  state: ReturnType<typeof PointerActionState>,
  settings: ReturnType<typeof PointerActionSettings>,
  executorMap: PointerActionExecutorMap
) => {
  const filteredByActionTypes = (by: ActionType[]) =>
    Array.from(state.state).filter(([, { action: { type } }]) =>
      by.includes(type)
    );

  const isUnique = (it: ActionType) =>
    Array.from(state.state.values())
      .map(({ action: { type } }) => type)
      .includes(it);
  const checkCondirions = (
    type: ActionType,
    conditions: PointerActionConditions
  ) => {
    const { unique, overwrites, premise } = conditions;
    if (unique && isUnique(type)) return;
    const mayBeOverwrites = filteredByActionTypes(overwrites);
    if (mayBeOverwrites.length < premise) return;
    const overwriteTargets = mayBeOverwrites.slice(-premise);
    return { type, conditions, overwriteTargets };
  };

  const findAction = () =>
    Array.from(settings)
      .reverse()
      .map(([type, conditions]) => {
        const { unique, overwrites, premise } = conditions;
        if (unique && isUnique(type)) return;
        const mayBeOverwrites = filteredByActionTypes(overwrites);
        if (mayBeOverwrites.length < premise) return;
        const overwriteTargets = mayBeOverwrites.slice(-premise);
        return { type, conditions, overwriteTargets };
      })
      .find((it) => it);

  const getEvents = (
    latest: Event,
    from: ReturnType<typeof filteredByActionTypes>
  ) => [
    latest,
    ...from
      .map(([, { event }]) => event)
      .filter((it) => it.pointerId != latest.pointerId)
      .reverse(),
  ];

  const execute = (
    it: ReturnType<typeof state.get>,
    executionName: keyof PointerActionExecutor
  ) => {
    if (!it) return;
    it.action.executor[executionName](
      getEvents(it.event, filteredByActionTypes([it.action.type]))
    );
    return it;
  };

  const applyResidue = (from: ReturnType<typeof state.get>) => {
    if (!from) return;
    const before = from.action.type;
    const { residue, premise } = from.action.conditions;
    const conditions = settings.get(residue);
    if (!conditions) return;
    const [, ...targets] = filteredByActionTypes([before])
      .slice(-(premise + 1))
      .reverse();
    const residual = !!checkCondirions(residue, conditions);

    targets.forEach(([id, it]) => {
      if (residual)
        state.set(id, { ...it, action: { ...it.action, type: residue } });
      else state.delete(id);
    });
    if (!residual) return;
    const executor = executorMap.get(residue);
    executor.down(targets.map(([, { event }]) => event).reverse());
  };

  return {
    listeners: {
      onPointerOver: () => {},
      onPointerEnter: () => {},
      onPointerDown: (event: Event) => {
        const finded = findAction();
        if (!finded) return;
        const executor = executorMap.get(finded.type);
        const action = { ...finded, executor };
        finded.overwriteTargets.forEach(([id, prev]) =>
          state.set(id, { ...prev, action })
        );
        action.executor.down(getEvents(event, finded.overwriteTargets));
        state.set(event.pointerId, { event, action });
      },
      onPointerMove: (event: Event) => {
        state.set(event.pointerId, (prev) => {
          if (!prev) return;
          return execute({ ...prev, event }, "move");
        });
      },
      onPointerUp: (event: Event) =>
        state.delete(event.pointerId, (prev) => {
          const next = { ...prev, event };
          execute(next, "up");
          applyResidue(next);
        }),
      onPointerCancel: (event: Event) =>
        state.delete(event.pointerId, (prev) => {
          const next = { ...prev, event };
          execute(next, "cancel");
          applyResidue(next);
        }),
      onPointerOut: () => {},
      onPointerLeave: () => {},
    },
  };
};
const PointerActionDistributor = Distributor;
export default PointerActionDistributor;
