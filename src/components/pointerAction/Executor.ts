import Event from "./type/Event";

type Executor = {
  down: (events: Event[]) => void;
  move: (events: Event[]) => void;
  up: (events: Event[]) => void;
  cancel: (events: Event[]) => void;
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
