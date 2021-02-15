import { PointerActionConditions } from "./Settings";
import { PointerActionExecution } from "./Executor";
import useIdMapState from "../pianoroll/canvas/useIdMapState";

type PointerId = number;
type Event = React.PointerEvent;

type ActionType = string;
type Info = {
  event: Event;
  action: {
    type: ActionType;
    conditions: PointerActionConditions;
    executor: PointerActionExecution;
  };
};
const State = () => {
  return useIdMapState<Info>();
};
type PointerActionState = Map<PointerId, Info>;
const PointerActionState = State;
export default PointerActionState;
