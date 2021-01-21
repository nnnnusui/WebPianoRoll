import React from "react";
import Note from "./Note";

type Props = {
  hasNoteInit: boolean;
} & Needs &
  Values;
type Needs = {
  appendNote: (offset: number, octave: number, pitch: number) => void;
  removeNote: (offset: number, octave: number, pitch: number) => void;
};
type Values = {
  offset: number;
  octave: number;
  pitch: number;
};
const Cell: React.FC<Props> = ({
  hasNoteInit,
  offset,
  octave,
  pitch,
  appendNote,
  removeNote,
}) => {
  const onMouseDown = (event: React.MouseEvent) => {
    switch (event.button) {
      case 0:
        if (!hasNoteInit) appendNote(offset, octave, pitch);
        break;
      case 2:
        if (hasNoteInit) removeNote(offset, octave, pitch);
        break;
    }
    event.preventDefault();
  };
  const notes = () => {
    if (hasNoteInit) return <Note></Note>;
  };
  return (
    <div
      className="cell relative h-full w-full bg-gray-600"
      onMouseDown={onMouseDown}
      onContextMenu={(event) => event.preventDefault()}
    >
      {notes()}
    </div>
  );
};

export default Cell;
export type { Needs as CellNeeds };
