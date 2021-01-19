import React from "react";
import Octave from "./Octave";

type Props = {
  offset: number;
} & Inputs;
type Inputs = {
  minOctave: number;
  maxOctave: number;
};
const Time: React.FC<Props> = ({ minOctave, maxOctave, ...props }) => {
  const distance = maxOctave + 1 - minOctave;
  const octaves = [...Array(distance)]
    .map((_, index) => minOctave + index)
    .reverse()
    .map((octave) => <Octave key={octave} octave={octave} {...props} />);
  return <div className="time h-full w-full flex flex-col">{octaves}</div>;
};
export default Time;
export type { Inputs as TimeInputs };
