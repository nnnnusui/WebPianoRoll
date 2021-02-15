import DummyAction from "./dummy/DummyAction";
import ActionType from "./type/ActionType";
import Event from "./type/Event";

type Execute = (events: Event[]) => void;
type Execution = {
  execute: Execute;
  mayBeExecute: Execute;
  cancel: Execute;
};
type PartialExecutor = (events: Event[]) => Partial<Execution>;
type Override = {
  type: ActionType;
  executor: PartialExecutor;
};
const empty: Execution = {
  execute: () => {},
  mayBeExecute: () => {},
  cancel: () => {},
};

type PointerActionExecution = Execution;
const PointerActionExecutor = {
  getMap: (overrides: Override[]) => {
    const map = new Map<ActionType, PartialExecutor>(
      [DummyAction(), ...overrides].map(({ type, executor }) => [
        type,
        executor,
      ])
    );
    const get = (key: ActionType) => map.get(key) || (() => empty);
    return {
      ...map,
      use: (key: ActionType, events: Event[]) => ({
        ...empty,
        ...get(key)(events),
      }),
    };
  },
};
type PointerActionExecutorOverride = Override;
type PointerActionExecutorMap = ReturnType<typeof PointerActionExecutor.getMap>;
export default PointerActionExecutor;
export type {
  PointerActionExecutorOverride,
  PointerActionExecutorMap,
  PointerActionExecution,
};
