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
  const filterByActionTypes = (from: PointerActionState, by: ActionType[]) =>
    Array.from(from).filter(([, { action: { type } }]) => by.includes(type));

  const isUnique = (state: PointerActionState, it: ActionType) =>
    Array.from(state.values())
      .map(({ action: { type } }) => type)
      .includes(it);
  const findAction = (state: PointerActionState) =>
    Array.from(settings)
      .reverse()
      .map(([type, conditions]) => {
        const { unique, overwrites, premise } = conditions;
        if (unique && isUnique(state, type)) return;
        const mayBeOverwrites = filterByActionTypes(state, overwrites);
        if (mayBeOverwrites.length < premise) return;
        const overwriteTargets = mayBeOverwrites.slice(-premise);
        return { type, conditions, overwriteTargets };
      })
      .find((it) => it);

  return {
    listeners: {
      onPointerOver: () => {},
      onPointerEnter: () => {},
      onPointerDown: (event: Event) => {
        state.use((state) => {
          const finded = findAction(state);
          if (!finded) return;
          const executor = PointerActionExecutor.toRequired(
            DummyAction().executor
          );
          const action = { ...finded, executor };
          state.set(event.pointerId, { event, action });
        });
      },
      onPointerMove: (event: Event) => {
        state.set(event.pointerId, (prev) => {
          if (!prev) return;
          return { ...prev, event };
        });
      },
      onPointerUp: (event: Event) => {
        state.delete(event.pointerId);
      },
      onPointerCancel: (event: Event) => {
        state.delete(event.pointerId);
      },
      onPointerOut: () => {},
      onPointerLeave: () => {},
    },
  };
};
const PointerActionDistributor = Distributor;
export default PointerActionDistributor;
