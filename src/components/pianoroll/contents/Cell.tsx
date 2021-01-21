import { deepStrictEqual } from "assert";
import React from "react";
import { isDeepStrictEqual } from "util";
import Note from "./Note";

type Props = {
} & Needs
  & Values;
type Needs = {
  initNotes: Array<Values>;
  selectedCells: Array<Values>;
  appendNote: (offset: number, octave: number, pitch: number) => void;
  removeNote: (offset: number, octave: number, pitch: number) => void;
  selectStart: (from: Values, to: Values) => void;
  selectMove: (to: Values) => void;
  selectEnd: (to: Values) => void;
};
type Values = {
  offset: number;
  octave: number;
  pitch: number;
};
const Cell: React.FC<Props> = ({
  initNotes,
  selectedCells,
  offset,
  octave,
  pitch,
  appendNote,
  removeNote,
  selectStart,
  selectMove,
  selectEnd,
}) => {
  const value: Values = {offset: offset, octave: octave, pitch: pitch}
  const hasNote = initNotes
  .filter(it=> it.octave == value.octave)
  .filter(it=> it.offset == value.offset)
  .some(it=> it.pitch == value.pitch)
  const selected = selectedCells
  .filter(it=> it.octave == value.octave)
  .filter(it=> it.offset == value.offset)
  .some(it=> it.pitch == value.pitch)
  const onClick = (event: React.MouseEvent) => {
    switch (event.button) {
      case 0:
        if (!hasNote) appendNote(offset, octave, pitch);
        break;
      case 2:
        if (hasNote) removeNote(offset, octave, pitch);
        break;
    }
  };
  const notes = () => {
    if (hasNote) return <Note stickLeft={false} stickRight={false}></Note>;
  };
  return (
    <div
      className="cell relative h-full w-full bg-gray-600 rounded-sm"
      onContextMenu={(event) =>{ if(!event.altKey) event.preventDefault()}}
      onMouseDown={() => selectStart(value, value)}
      onMouseMove={()=> selectMove(value)}
      onMouseUp={() => selectEnd(value)}
    >
      {notes()}
      <div className={`action-view absolute h-full w-full bg-blue-900 ${selected ? "opacity-50" : "opacity-0"}`}></div>
    </div>
  );
};

export default Cell;
export type { Needs as CellNeeds };
export type { Values as CellValues };
