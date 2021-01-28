import React from "react";
import PutNote from "../../contexts/PutNoteContext";
import getCellFromPoint from "../getCellFromPoint";

type Props = {
  gridIndexToPos: (gridIndex: number) => { x: number; y: number };
} & Needs;
type Needs = {
  gridIndex: number;
  length: number;
  childRollId: number | null;
};
const selfType = "Note";
const Note: React.FC<Props> = ({
  gridIndex,
  length,
  childRollId,
  gridIndexToPos,
}) => {
  // console.log(`rerender: Note _ ${childRollId}`)
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

  const pos = gridIndexToPos(gridIndex);
  const style = {
    gridColumnStart: pos.x + 1,
    gridRowStart: pos.y + 1,
    gridColumnEnd: pos.x + length + 1,
  };
  return (
    <div
      {...{ type: selfType, gridindex: gridIndex }}
      className="pointer-events-auto bg-yellow-500 rounded-lg"
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      {childRollId}
    </div>
  );
};

export default Note;
export type { Needs as NoteNeeds };