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
  const notes = Array.from(notesState);

  return (
    <>
      {notes.map(([noteId]) => (
        <Note key={noteId} {...{ rollId, id: noteId }} />
      ))}
    </>
  );
};
export default Notes;
