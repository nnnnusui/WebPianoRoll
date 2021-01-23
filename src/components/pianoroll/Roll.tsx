import React, { useEffect, useState } from "react";
import typedFetch from "../typedFetch";
import Grid from "./contexts/GridContext";
import Note from "./Note";

type RollRest = {
  division: number;
};
type NoteRest = {
  offset: number;
  octave: number;
  pitch: number;
};

type Props = {
  urlRoot: string;
  rollId: number;
};
const Roll: React.FC<Props> = ({ urlRoot, rollId }) => {
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
      const minOctave = 0;
      const maxOctave = 0;
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

  const put_note = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    const length = to.x + 1 - from.x;
    if (length < 1) return;
    const fixedY = grid.height - from.y;
    const note: NoteRest = {
      offset: from.x,
      octave: Math.floor(fixedY / roll.maxPitch),
      pitch: fixedY % roll.maxPitch,
    };
    setNotes(prev=> [...prev, note])
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
        return <Note key={index} {...{ pos }}></Note>;
      })}
    </div>
  );
};

export default Roll;
