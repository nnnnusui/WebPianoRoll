import DummyAction from "./dummy/DummyAction";
import PointerActionExecutor from "./Executor";
import PointerActionSettings from "./Settings";
import PointerActionState from "./State";
import Event from "./type/Event";

const Distributor = (
  state: ReturnType<typeof PointerActionState>,
  settings: ReturnType<typeof PointerActionSettings>
) => {
  return {
    listeners: {
      onPointerOver: () => {},
      onPointerEnter: () => {},
      onPointerDown: (event: Event) => {
        const type = "dummy";
        const conditions = settings.get(type)!;
        const executor = PointerActionExecutor.toRequired(
          DummyAction().executor
        );
        const action = { type, conditions, executor };
        state.set(event.pointerId, { event, action });
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
