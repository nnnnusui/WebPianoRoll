import React from "react";
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
  const onMouseUp = (event: React.MouseEvent) => {
    setNotes({ type: "remove", index });
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
      onMouseUp={onMouseUp}
    ></div>
  );
};

export default Note;
export type { Needs as NoteNeeds };
