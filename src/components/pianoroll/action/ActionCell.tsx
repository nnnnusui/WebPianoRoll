import React from "react";
import PutNote from "../contexts/PutNoteContext";
import getCellFromPoint from "../getCellFromPoint";

type Props = {
  gridIndex: number;
};

const selfType = "ActionCell";
const ActionCell: React.FC<Props> = ({ gridIndex }) => {
  // console.log("rerender: ActionCell");
  const putNote = {
    setFrom: PutNote.Contexts.from.Dispatch(),
    setTo: PutNote.Contexts.to.Dispatch(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setFrom({ type: selfType, gridIndex });
  };
  const onMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    putNote.setTo({ type: selfType, gridIndex });
    putNote.setApply(true);
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    event.preventDefault();
    const to = getCellFromPoint(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY
    );
    if (to == undefined) return;
    putNote.setFrom({ type: selfType, gridIndex });
    putNote.setTo(to);
    putNote.setApply(true);
  };
  return (
    <div
      {...{ type: selfType, gridindex: gridIndex }}
      className="action-cell relative h-full w-full bg-gray-600 rounded-sm"
      onContextMenu={suplessRightClickMenu}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    ></div>
  );
};

const suplessRightClickMenu = (event: React.MouseEvent) => {
  if (!event.altKey) event.preventDefault();
};

export default ActionCell;
