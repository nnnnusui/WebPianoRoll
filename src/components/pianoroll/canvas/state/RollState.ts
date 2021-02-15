import { Size } from "../type/Size";
import useIdMapState from "../useIdMapState";

type Roll = {
  maxOffset: number;
  maxOctave: number;
  minOctave: number;
  maxPitch: number;
};
const RollState = () => {
  const state = useIdMapState<Roll>();

  return state;
};
export default RollState;
