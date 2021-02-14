import Event from "./type/Event";

type Execution = (events: Event[]) => void;
type Executor = {
  down: Execution;
  move: Execution;
  up: Execution;
  cancel: Execution;
};
type Override = Partial<Executor>;

type PointerActionExecutor = Executor;
const PointerActionExecutor = {
  toRequired: (it: Override): Executor => ({
    down: it.down || (() => {}),
    move: it.move || (() => {}),
    up: it.up || (() => {}),
    cancel: it.cancel || (() => {}),
  }),
};
type PointerActionExecutorOverride = Override;
export default PointerActionExecutor;
export type { PointerActionExecutorOverride };
