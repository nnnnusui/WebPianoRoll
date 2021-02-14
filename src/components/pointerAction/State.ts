import useMapState from "../pianoroll/canvas/useMapState";
import Executor from "./Executor";

type PointerId = number;
type Event = React.PointerEvent;

type ActionType = string;
type Info = {
  event: Event;
  action: {
    type: ActionType;
    contractor: void;
    executor: Executor;
  };
};
const State = () => {
  return useMapState<PointerId, Info>();
};
const PointerActionState = State;
export default PointerActionState;
