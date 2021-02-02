import React, { useEffect } from "react";
import Context from "../context/Context";
import Note from "./Note";

type Props = {
  rollId: number;
};
const Notes: React.FC<Props> = ({ rollId }) => {
  const notesState = Context.notes.State().get(rollId);
  if (notesState == null) {
    const noteAction = Context.notes.Dispatch();
    useEffect(() => {
      noteAction({ type: "getAll", rollId });
    }, [rollId]);
    return <></>;
  }
  const roll = Context.rolls.State().get(rollId)?.data;
  if (roll == null) return <></>;
  const notes = Array.from(notesState);

  const posFromNoteData = (note: {
    offset: number;
    octave: number;
    pitch: number;
  }) => ({
    x: note.offset,
    y:
      (roll.maxOctave - note.octave) * roll.maxPitch +
      (roll.maxPitch - note.pitch - 1),
  });
  const gridIndexFromPos = (pos: ReturnType<typeof posFromNoteData>) =>
    pos.x * roll.height + pos.y;
  return (
    <>
      {notes.map(([noteId, { data }]) => {
        const pos = posFromNoteData(data);
        const gridIndex = gridIndexFromPos(pos);
        return (
          <Note
            key={noteId}
            {...{ rollId, id: noteId, posFromNoteData, gridIndexFromPos }}
          />
        );
      })}
    </>
  );
};
export default Notes;
