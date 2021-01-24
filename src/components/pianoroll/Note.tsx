import React from "react";
import PutNote from "./contexts/PutNoteContext";

type Props = {
  index: number;
} & Needs;
type Needs = {
  pos: { x: number; y: number };
  length: number;
};
const Note: React.FC<Props> = ({ index, pos, length }) => {
  const putNote = {
    setFrom: PutNote.Contexts.from.Dispatch(),
    setTo: PutNote.Contexts.to.Dispatch(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setFrom({ type: "Note", index });
  };
  const onMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setTo({ type: "Note", index });
    putNote.setApply(true);
  };

  const style = {
    gridColumnStart: pos.x + 1,
    gridRowStart: pos.y + 1,
    gridColumnEnd: pos.x + length + 1,
  };
  return (
    <div
      className="pointer-events-auto bg-yellow-500 rounded-lg"
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      draggable="false"
    ></div>
  );
};

export default Note;
export type { Needs as NoteNeeds };
