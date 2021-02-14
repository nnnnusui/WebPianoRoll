import DummyAction from "./dummy/DummyAction";
import ActionType from "./type/ActionType";
import Event from "./type/Event";

type Execution = (events: Event[]) => void;
type Executor = {
  down: Execution;
  move: Execution;
  up: Execution;
  cancel: Execution;
};
type Override = {
  type: ActionType;
  executor: Partial<Executor>;
};

type PointerActionExecutor = Executor;

const toRequired = (it: Partial<Executor>): Executor => ({
  down: it.down || (() => {}),
  move: it.move || (() => {}),
  up: it.up || (() => {}),
  cancel: it.cancel || (() => {}),
});

const PointerActionExecutor = {
  getMap: (overrides: Override[]) => {
    const map = new Map(
      [DummyAction(), ...overrides].map(({ type, executor }) => [
        type,
        toRequired(executor),
      ])
    );
    return {
      ...map,
      get: (key: ActionType) => map.get(key) || toRequired({}),
    };
  },
};
type PointerActionExecutorOverride = Override;
type PointerActionExecutorMap = ReturnType<typeof PointerActionExecutor.getMap>;
export default PointerActionExecutor;
export type { PointerActionExecutorOverride, PointerActionExecutorMap };
