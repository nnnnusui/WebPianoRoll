import React, { useState } from "react";
import PutNote from "./contexts/PutNoteContext";
import { NoteAction } from "./Roll";

type Props = {
  index: number;
  setNotes: React.Dispatch<NoteAction>;
} & Needs;
type Needs = {
  pos: { x: number; y: number };
  length: number;
};
const Note: React.FC<Props> = ({ index, pos, length, setNotes }) => {
  const putNote = {
    from: PutNote.Contexts.from.State(),
    to: PutNote.Contexts.to.State(),
    setEvent: PutNote.Contexts.event.Dispatch(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };
  const [fromSelf, setFromSelf] = useState(false);

  const onMouseDown = (event: React.MouseEvent) => {
    setFromSelf(true);
    putNote.setEvent({ type: "fromNote", index });
  };
  const onMouseUp = (event: React.MouseEvent) => {
    if (fromSelf) setNotes({ type: "remove", index });
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
