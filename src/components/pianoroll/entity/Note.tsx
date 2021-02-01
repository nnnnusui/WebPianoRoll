import React from "react";
import Context from "../context/Context";

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
  };
  const info = { type: selfType, gridindex: gridIndex, noteid: id };
  return (
    <div
      {...{ type: selfType, gridindex: gridIndex, noteid: id }}
      className="pointer-events-auto flex flex-row bg-yellow-500 rounded-lg"
      style={style}
    >
      <div
        {...{ ...info, part: "left" }}
        className="w-full max-w-border cursor-resize-v"
      />
      <div {...{ ...info, part: "center" }} className="w-full cursor-move">
        {note.childRollId}
      </div>
      <div
        {...{ ...info, part: "right" }}
        className="w-full max-w-border cursor-resize-v"
      />
    </div>
  );
};

export default Note;
