import React, { useState, ReactNode, useEffect } from "react";
import Note from "./Note";

type Props = {
  hasNoteInit: boolean
} &Needs & Values;
type Needs = {
  event: (
    beforeState: boolean,
    offset: number,
    octave: number,
    pitch: number
  ) => void;
};
type Values = {
  offset: number;
  octave: number;
  pitch: number;
};
const Cell: React.FC<Props> = ({ hasNoteInit, offset, octave, pitch, event }) => {
  const [hasNote, setState] = useState(false);
  useEffect(() => setState(hasNoteInit))
  const onClick = () => event(hasNote, offset, octave, pitch);
  const notes = (): ReactNode => {
    if (hasNoteInit) return <Note></Note>;
  };
  return (
    <div className="cell relative h-full w-full bg-gray-600" onClick={onClick}>
      {notes()}
    </div>
  );
};

export default Cell;
export type { Needs as CellNeeds };
