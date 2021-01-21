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
  const [count] = useState(0);
  const [division, setState] = useState(0);
  const [notes, setNotes] = useState<Array<NoteRest>>([]);
  useEffect(() => {
    typedFetch<RollRest>(rollUrl).then((result) => setState(result.division));
    typedFetch<{ values: Array<NoteRest> }>(notesUrl).then((result) =>
      setNotes(result.values)
    );
  }, [count]);
  const appendNote = (offset: number, octave: number, pitch: number) => {
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
  const removeNote = (offset: number, octave: number, pitch: number) => {
    setNotes(
      notes.filter(
        (it) =>
          !(it.offset == offset && it.octave == octave && it.pitch == pitch)
      )
    );
    typedFetch<NoteRest>(
      `${notesUrl}?offset=${offset}&octave=${octave}&pitch=${pitch}`,
      {
        method: "DELETE",
      }
    );
  };
  const props = {
    initNotes: notes,
    maxOffset: division,
    minOctave: -1,
    maxOctave: 1,
    appendNote: appendNote,
    removeNote: removeNote,
  };
  return <Bar {...props}></Bar>;
};

export default Roll;
