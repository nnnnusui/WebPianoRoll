import { PointerActionExecutorOverride } from "../Executor";

const DummyAction = (): PointerActionExecutorOverride => {
  return { type: "dummy", executor: {} };
};
export default DummyAction;
