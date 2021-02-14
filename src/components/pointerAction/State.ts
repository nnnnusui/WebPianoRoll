import useMapState from "../pianoroll/canvas/useMapState";
import { PointerActionConditions } from "./Settings";

type PointerId = number;
type Event = React.PointerEvent;

type ActionType = string;
type Info = {
  event: Event;
  action: {
    type: ActionType;
    conditions: PointerActionConditions;
  };
};
const State = () => {
  return useMapState<PointerId, Info>();
};
type PointerActionState = Map<PointerId, Info>;
const PointerActionState = State;
export default PointerActionState;
