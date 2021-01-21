import React from "react";
import Octave, { OctaveNeeds } from "./Octave";
import range from "../../range";

type Props = {
  initNotes: Array<{ octave: number; pitch: number }>;
  offset: number;
} & Inputs &
  Needs;
type Inputs = {
  minOctave: number;
  maxOctave: number;
};
type Needs = OctaveNeeds;
const Time: React.FC<Props> = ({
  initNotes,
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
        initNotes={initNotes
          .filter((it) => it.octave == octave)
          .map((it) => {
            return { pitch: it.pitch };
          })}
        {...props}
      />
    ));
  return <div className="time h-full w-full flex flex-col">{octaves}</div>;
};
export default Time;
export type { Inputs as TimeInputs };
export type { Needs as TimeNeeds };
