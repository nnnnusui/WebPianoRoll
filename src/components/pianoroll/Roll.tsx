import React, { useEffect, useState } from "react";
import typedFetch from "../typedFetch";
import Note from "./Note";
import { useGridContext } from "./GridContext";

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
  const pitch = 12;
  const { size, setSize } = useGridContext();
  const [notes, setNotes] = useState<Array<NoteRest>>([]);
  const rollUrl = `${urlRoot}${rollId}`;
  useEffect(() => {
    const notesUrl = `${rollUrl}/notes`;
    typedFetch<RollRest>(rollUrl).then((result) => {
      const offset = result.division;
      const minOctave = -1;
      const maxOctave = 1;
      const octave = maxOctave + 1 - minOctave;
      const height = octave * pitch;
      const width = offset;
      setSize({ width, height });
    });
    typedFetch<{ values: Array<NoteRest> }>(notesUrl).then((result) =>
      setNotes(result.values)
    );
  }, [rollUrl, setSize]);
  const style = {
    gridTemplateColumns: `repeat(${size.width}, 1fr)`,
    gridTemplateRows: `repeat(${size.height}, 1fr)`,
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
