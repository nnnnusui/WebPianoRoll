import React from "react";
import Context from "../context/Context";
import Roll from "./Roll";

type Props = {
  rollId: number;
  id: number;
};
const selfType = "Note";
const Note: React.FC<Props> = ({ rollId, id }) => {
  const roll = Context.rolls.State().get(rollId)?.data;
  const note = Context.notes.State().get(rollId)?.get(id)?.data;
  if (roll == null) return <></>;
  if (note == null) return <></>;
  const childRollId = note.childRollId;
  const childRoll = childRollId
    ? Context.rolls.State().get(childRollId)?.data
    : null;

  const pos = {
    x: note.offset,
    y:
      (roll.maxOctave - note.octave) * roll.maxPitch +
      (roll.maxPitch - note.pitch - 1),
  };
  const gridIndex = pos.x * roll.height + pos.y;

  const style = {
    gridColumnStart: pos.x + 1,
    gridRowStart: pos.y + 1,
    gridColumnEnd: pos.x + note.length + 1,
    // gridTemplateColumns: `repeat(${childRoll?.width || 1}, 1fr)`,
    // gridTemplateRows: `repeat(${childRoll?.height || 1}, 1fr)`,
  };
  const color = childRoll ? "bg-transparent" : "bg-yellow-500";
  const info = { type: selfType, gridindex: gridIndex, noteid: id };
  const actionLayer = (
    <div
      {...{ type: selfType, gridindex: gridIndex, noteid: id }}
      className={`absolute w-full h-full flex flex-row rounded-lg ${color} border-solid border-4 border-gray-800`}
    >
      <div
        {...{ ...info, part: "left" }}
        className="w-full max-w-border cursor-resize-v"
      />
      <div {...{ ...info, part: "center" }} className="w-full cursor-move">
        {childRoll?.id}
      </div>
      <div
        {...{ ...info, part: "right" }}
        className="w-full max-w-border cursor-resize-v"
      />
    </div>
  );
  return childRoll ? (
    <Roll {...childRoll}></Roll>
  ) : (
    <div style={style} className="pointer-events-auto relative grid">
      {actionLayer}
    </div>
  );
};

export default Note;
