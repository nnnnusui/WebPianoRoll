import React from "react";
import Context from "../context/Context";

type Props = {
  rollId: number;
  id: number;
};
const selfType = "Note";
const Note: React.FC<Props> = ({ rollId, id }) => {
  const roll = Context.rolls.State().get(id)?.data;
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
  return (
    <div
      {...{ type: selfType, gridindex: gridIndex }}
      className="pointer-events-auto bg-yellow-500 rounded-lg"
      style={style}
    >
      {note.childRollId}
    </div>
  );
};

export default Note;
