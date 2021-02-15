import useMapState from "../pianoroll/canvas/useMapState";
import { PointerActionConditions } from "./Settings";
import { PointerActionExecution } from "./Executor";

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
  return useMapState<PointerId, Info>();
};
type PointerActionState = Map<PointerId, Info>;
const PointerActionState = State;
export default PointerActionState;
