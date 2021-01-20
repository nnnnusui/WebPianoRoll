import React from "react";

type Props = {
  offset: number;
  octave: number;
  pitch: number;
} & Needs;
type Needs = {
  event: (offset: number, octave: number, pitch: number) => void;
};
const Cell: React.FC<Props> = ({ offset, octave, pitch, event }) => (
  <div className="relative cell h-full w-full">
    <div
      className="absolute h-full w-full flex-col-reverse bg-gray-600"
      onClick={() => event(offset, octave, pitch)}
    ></div>
  </div>
);

export default Cell;
export type { Needs as CellNeeds };
