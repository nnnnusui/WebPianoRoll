import DummyAction from "./dummy/DummyAction";
import PointerActionExecutor from "./Executor";
import PointerActionSettings from "./Settings";
import PointerActionState from "./State";
import ActionType from "./type/ActionType";
import Event from "./type/Event";

const Distributor = (
  state: ReturnType<typeof PointerActionState>,
  settings: ReturnType<typeof PointerActionSettings>
) => {
  const filteredByActionTypes = (by: ActionType[]) =>
    Array.from(state.state).filter(([, { action: { type } }]) =>
      by.includes(type)
    );

  const isUnique = (it: ActionType) =>
    Array.from(state.state.values())
      .map(({ action: { type } }) => type)
      .includes(it);
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
  ) => [latest, ...from.map(([, { event }]) => event).reverse()];

  const execute = (
    it: ReturnType<typeof state.get>,
    executionName: keyof PointerActionExecutor
  ) => {
    if (!it) return;
    it.action.executor[executionName](
      getEvents(it.event, filteredByActionTypes([it.action.type]))
    );
  };

  return {
    listeners: {
      onPointerOver: () => {},
      onPointerEnter: () => {},
      onPointerDown: (event: Event) => {
        const finded = findAction();
        if (!finded) return;
        const executor = PointerActionExecutor.toRequired(
          DummyAction().executor
        );
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
          execute(prev, "move");
          return { ...prev, event };
        });
      },
      onPointerUp: (event: Event) =>
        state.delete(event.pointerId, (prev) => execute(prev, "up")),
      onPointerCancel: (event: Event) =>
        state.delete(event.pointerId, (prev) => execute(prev, "cancel")),
      onPointerOut: () => {},
      onPointerLeave: () => {},
    },
  };
};
const PointerActionDistributor = Distributor;
export default PointerActionDistributor;
