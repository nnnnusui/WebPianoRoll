import React, { useEffect, useState, ReactElement } from "react";
import typedFetch from "../typedFetch";
import Bar from "./contents/Bar";

type RollRest = {
  division: number;
};
type NoteRest = {
  offset: number;
  octave: number;
  pitch: number;
};
const rollUrl = "http://localhost:8080/rest/1/rolls/1";
const notesUrl = `${rollUrl}/notes`;

const Roll = (): ReactElement => {
  const [count, _] = useState(0);
  const [division, setState] = useState(0);
  const [notes, setNotes] = useState<Array<NoteRest>>([]);
  useEffect(() => {
    typedFetch<RollRest>(rollUrl).then((result) => setState(result.division));
    typedFetch<{values: Array<NoteRest>}>(notesUrl).then((result) => setNotes(result.values));
  }, [count]);
  const onCellClick = (
    beforeState: boolean,
    offset: number,
    octave: number,
    pitch: number
  ) => {
    if (beforeState) return beforeState;
    const postNote: NoteRest = { offset, octave, pitch };
    setNotes(notes.concat(postNote));
    typedFetch<NoteRest>(notesUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postNote),
    });
  };
  const props = {
    initNotes: notes,
    maxOffset: division,
    minOctave: -1,
    maxOctave: 1,
    event: onCellClick,
  };
  return (
    <Bar {...props}></Bar>
  );
};

export default Roll;
