import React from "react";
import Octave, { OctaveNeeds } from "./Octave";
import range from "../../range";
import { CellValues } from "./Cell";
import Diff from "../../Diff";

type Props = {
} & Values & Inputs & Needs;
type Values = {
  offset: number
}
type Inputs = {
  minOctave: number;
  maxOctave: number;
};
type Needs = OctaveNeeds;

const Time: React.FC<Props> = ({
  minOctave,
  maxOctave,
  ...props
}) => {
  const octaves = range(minOctave, maxOctave + 1)
    .reverse()
    .map((octave) => (
      <Octave
        key={octave}
        octave={octave}
        {...props}
      />
    ));
  return <div className="time h-full w-full flex flex-col">{octaves}</div>;
};
export default Time;
export type { Values as TimeValues };
export type { Inputs as TimeInputs };
export type { Needs as TimeNeeds };
