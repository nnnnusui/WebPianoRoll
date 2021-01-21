import React from "react";
import Time, { TimeInputs, TimeNeeds } from "./Time";
import { range0to } from "../../range";

type Props = {
  initNotes: Array<{ offset: number; octave: number; pitch: number }>;
} & Inputs & Needs;
type Inputs = {
  maxOffset: number;
} & TimeInputs;
type Needs = TimeNeeds;
type X = { offset: number; octave: number; pitch: number }
const Bar: React.FC<Props> = ({ initNotes, maxOffset, ...props }) => {
  const times = range0to(maxOffset).map((index) => (
    <Time
      key={index}
      offset={index}
      initNotes={initNotes
        .filter((it) => it.offset === index)
        .map((it) => {
          return { octave: it.octave, pitch: it.pitch };
        })}
      {...props}
    />
  ));
  return <div className="bar flex h-full w-full">{times}</div>;
};

export default Bar;
