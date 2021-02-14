import { PointerActionExecutorOverride } from "../Executor";

const DummyAction = () => {
  const executor: PointerActionExecutorOverride = {};
  return { executor };
};
export default DummyAction;
