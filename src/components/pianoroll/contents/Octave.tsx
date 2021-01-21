import React from "react";
import Cell, { CellNeeds, CellValues } from "./Cell";
import { range0to } from "../../range";
import Diff from "../../Diff";

type Props = {
} & Values & Needs;
type Values = {
  offset: number;
  octave: number;
}
type Needs = CellNeeds;

const Octave: React.FC<Props> = ({ ...props }) => {
  const cells = range0to(12)
    .reverse()
    .map((index) => (
      <Cell
        key={index}
        pitch={index}
        {...props}
      />
    ));
  return <div className="octave h-full w-full flex flex-col">{cells}</div>;
};

export default Octave;
export type { Needs as OctaveNeeds };
