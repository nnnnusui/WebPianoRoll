import React from "react";
import Octave, { OctaveNeeds } from "./Octave";

type Props = {
  offset: number;
} & Inputs &
  Needs;
type Inputs = {
  minOctave: number;
  maxOctave: number;
};
type Needs = OctaveNeeds;
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
export type { Needs as TimeNeeds };
