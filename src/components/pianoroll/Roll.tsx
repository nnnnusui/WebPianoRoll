import React, { useEffect, useState, ReactElement } from "react";
import { isDeepStrictEqual } from "util";
import range from "../range";
import typedFetch from "../typedFetch";
import Bar from "./contents/Bar";
import { CellValues } from "./contents/Cell";

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
  const [selected, setSelected] = useState(false);
  const dummy: CellValues = {offset: 0, octave: 0, pitch: 0}
  const [selection, setSelection] = useState<{
   from: CellValues,
   to: CellValues, 
  }>({from: dummy, to: dummy});
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
    typedFetch<NoteRest>(`${notesUrl}?offset=${offset}&octave=${octave}&pitch=${pitch}`, {method: "DELETE"});
  };
  const selectStart = (from: CellValues, to: CellValues) => {
    setSelected(true)
    setSelection({from, to})
  }
  const selectMove = (to: CellValues) => {
    setSelection({from: selection!.from, to})
  }
  const selectEnd = (to: CellValues) => {
    setSelection({from: selection!.from, to})
    setSelected(false)
    const from = selection!.from
    if(from.offset == to.offset
      &&from.octave == to.octave
      &&from.pitch == to.pitch)
      console.log("equal")
  }
  const selectedCells: Array<CellValues> = (() => {
    if (selected) {
      const from = selection.from
      const to = selection.to
      const min = Math.min(from.offset, to.offset)
      const max = Math.max(from.offset, to.offset) + 1
      return range(min, max)
        .map<CellValues>(index=> {return {offset: index, octave: from.octave, pitch: from.pitch}})
    } else return []
  })()
  const props = {
    initNotes: notes,
    selectedCells: selectedCells,
    maxOffset: division,
    minOctave: -1,
    maxOctave: 1,
    appendNote: appendNote,
    removeNote: removeNote,
    selectStart: selectStart,
    selectMove: selectMove,
    selectEnd: selectEnd,
  };
  return <Bar {...props}></Bar>;
};

export default Roll;
