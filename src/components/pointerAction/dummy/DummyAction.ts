import { PointerActionExecutorOverride } from "../Executor";

const DummyAction = (): PointerActionExecutorOverride => {
  return {
    type: "dummy",
    executor: () => ({ execute: () => {}, mayBeExecute: () => {} }),
  };
};
export default DummyAction;
