import { Size } from "../type/Size";
import useIdMapState from "../../useIdMapState";

type RollId = number;
type Roll = {
  maxOffset: number;
  minOctave: number;
  maxOctave: number;
  maxPitch: number;
};
type View = Size;
const useRollState = () => {
  const state = useIdMapState<Roll>([
    [
      0,
      {
        maxOffset: 128,
        minOctave: -2,
        maxOctave: 1,
        maxPitch: 12,
      },
    ],
  ]);

  const getViewFromRoll = (roll: Roll): View => {
    const octaveRange = roll.maxOctave + 1 - roll.minOctave;
    const width = roll.maxOffset;
    const height = octaveRange * roll.maxPitch;
    return { width, height };
  };

  return {
    ...state,
    get: (key: RollId) => {
      const roll = state.get(key);
      if (!roll) return;
      return getViewFromRoll(roll);
    },
  };
};
export default useRollState;
