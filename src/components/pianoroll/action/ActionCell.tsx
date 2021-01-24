import React from "react";
import PutNote from "../contexts/PutNoteContext";

type Props = {
  pos: { x: number; y: number };
};
const ActionCell: React.FC<Props> = ({ pos }) => {
  // console.log("rerender: ActionCell");
  const putNote = {
    setFrom: PutNote.Contexts.from.Dispatch(),
    setTo: PutNote.Contexts.to.Dispatch(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setFrom({ type: "ActionCell", pos });
  };
  const onMouseMove = (event: React.MouseEvent) => {
    event.preventDefault();
  };
  const onMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setTo({ type: "ActionCell", pos });
    putNote.setApply(true);
  };
  return (
    <div
      className="relative h-full w-full bg-gray-600 rounded-sm"
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
