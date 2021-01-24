import React from "react";
import PutNote, { PutNoteMode } from "../contexts/PutNoteContext";

type Props = {
  pos: { x: number; y: number };
};
const ActionCell: React.FC<Props> = ({ pos }) => {
  // console.log("rerender: ActionCell");
  const putNote = {
    setFrom: PutNote.Contexts.from.Dispatch(),
    setTo: PutNote.Contexts.to.Dispatch(),
    setMode: PutNote.Contexts.mode.Dispatch(),
  };
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setMode(PutNoteMode.read)
    putNote.setFrom(pos);
  };
  const onMouseMove = (event: React.MouseEvent) => {
    event.preventDefault();
  };
  const onMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setTo(pos);
    putNote.setMode(PutNoteMode.fire)
  };
  return (
    <div
      className={`relative h-full w-full ${"bg-gray-600 rounded-sm"}`}
      onContextMenu={suplessRightClickMenu}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      draggable="true"
    ></div>
  );
};

const suplessRightClickMenu = (event: React.MouseEvent) => {
  if (!event.altKey) event.preventDefault();
};

export default ActionCell;
