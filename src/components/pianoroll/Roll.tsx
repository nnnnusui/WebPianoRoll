import React, { useEffect, useState } from "react";
import typedFetch from "../typedFetch";
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
  const [roll, setState] = useState<RollRest>({ division: 16 });
  const [notes, setNotes] = useState<Array<NoteRest>>([]);
  const rollUrl = `${urlRoot}${rollId}`;
  useEffect(() => {
    const notesUrl = `${rollUrl}/notes`;
    typedFetch<RollRest>(rollUrl).then((result) => setState(result));
    typedFetch<{ values: Array<NoteRest> }>(notesUrl).then((result) =>
      setNotes(result.values)
    );
  }, [rollUrl]);
  const offset = roll.division;
  const minOctave = -1;
  const maxOctave = 1;
  const octave = maxOctave + 1 - minOctave;
  const pitch = 12;
  const height = octave * pitch;
  const width = offset;
  const style = {
    gridTemplateRows: `repeat(${height}, 1fr)`,
    gridTemplateColumns: `repeat(${width}, 1fr)`,
  };
  return (
    <div
      className="pointer-events-none absolute h-full w-full grid grid-flow-col"
      style={style}
    >
      {notes.map((it, index) => {
        const pos = {
          x: it.offset,
          y: it.octave * pitch + it.pitch,
        };
        return <Note key={index} {...{ pos }}></Note>;
      })}
    </div>
  );
};

export default Roll;
