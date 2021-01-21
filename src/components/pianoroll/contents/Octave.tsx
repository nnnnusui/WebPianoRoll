import React from "react";
import Cell, { CellNeeds } from "./Cell";
import { range0to } from "../../range";

type Props = {
  initNotes: Array<{ pitch: number }>;
  offset: number;
  octave: number;
} & Needs;
type Needs = CellNeeds;
const Octave: React.FC<Props> = ({ initNotes, ...props }) => {
  const cells = range0to(12)
    .reverse()
    .map((index) => (
      <Cell
        key={index}
        pitch={index}
        hasNoteInit={initNotes.some((it) => it.pitch == index)}
        {...props}
      />
    ));
  return <div className="octave h-full w-full flex flex-col">{cells}</div>;
};

export default Octave;
export type { Needs as OctaveNeeds };
