import React, { useEffect, useState } from "react";
import typedFetch from "../typedFetch";
import Grid from "./contexts/GridContext";
import Selection, { SelectionMode } from "./contexts/SelectionContext";
import Note from "./Note";

type RollRest = {
  division: number;
};
type NoteRest = {
  offset: number;
  octave: number;
  pitch: number;
  length: number;
};

type Props = {
  urlRoot: string;
  rollId: number;
};
const Roll: React.FC<Props> = ({ urlRoot, rollId }) => {
  console.log("rerender: Roll");
  const [grid, setGrid] = [Grid.State(), Grid.Dispatch()];
  const [notes, setNotes] = useState<Array<NoteRest>>([]);
  const [roll, setRollInfo] = useState({
    maxOffset: 0,
    minOctave: 0,
    maxOctave: 0,
    maxPitch: 12,
  });
  const rollUrl = `${urlRoot}${rollId}`;
  useEffect(() => {
    const notesUrl = `${rollUrl}/notes`;
    typedFetch<RollRest>(rollUrl).then((result) => {
      const maxPitch = 12;
      const maxOffset = result.division;
      const minOctave = -1;
      const maxOctave = 1;
      const octave = maxOctave + 1 - minOctave;
      const height = octave * maxPitch;
      const width = maxOffset;
      setGrid({ width, height });
      setRollInfo({ maxOffset, minOctave, maxOctave, maxPitch });
    });
    typedFetch<{ values: Array<NoteRest> }>(notesUrl).then((result) =>
      setNotes(result.values)
    );
  }, [rollUrl, setGrid]);

  // TODO: from, to (put_note) の移動 (rerenderを抑えたい)
  const selection = {
    from: Selection.Contexts.from.State(),
    to: Selection.Contexts.to.State(),
    mode: Selection.Contexts.mode.State(),
  };
  useEffect(() => {
    if (selection.mode == SelectionMode.none)
      put_note(selection.from, selection.to);
  }, [selection.mode]);
  const put_note = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    const y = from.y;
    const note: NoteRest = {
      offset: Math.min(from.x, to.x),
      octave: Math.floor(y / roll.maxPitch),
      pitch: y % roll.maxPitch,
      length: Math.abs(from.x - to.x) + 1,
    };
    setNotes((prev) => [...prev, note]);
  };

  const style = {
    gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
    gridTemplateRows: `repeat(${grid.height}, 1fr)`,
  };
  return (
    <div
      className="pointer-events-none absolute h-full w-full grid grid-flow-col"
      style={style}
    >
      {notes.map((it, index) => {
        const pos = {
          x: it.offset,
          y: it.octave * roll.maxPitch + it.pitch,
        };
        const length = it.length;
        return <Note key={index} {...{ pos, length }}></Note>;
      })}
    </div>
  );
};

export default Roll;
