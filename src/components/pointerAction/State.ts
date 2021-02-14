import useMapState from "../pianoroll/canvas/useMapState";
import PointerActionExecutor from "./Executor";
import { PointerActionConditions } from "./Settings";

type PointerId = number;
type Event = React.PointerEvent;

type ActionType = string;
type Info = {
  event: Event;
  action: {
    type: ActionType;
    conditions: PointerActionConditions;
    executor: PointerActionExecutor;
  };
};
const State = () => {
  return useMapState<PointerId, Info>();
};
const PointerActionState = State;
export default PointerActionState;
