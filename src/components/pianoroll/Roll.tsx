import React, { useEffect, useReducer } from "react";
import typedFetch from "../typedFetch";
import Grid from "./contexts/GridContext";
import PutNote from "./contexts/PutNoteContext";
import Note, { NoteNeeds } from "./Note";

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

type NoteAction =
  | {
      type: "init";
      value: Array<NoteNeeds>;
    }
  | {
      type: "add";
      value: NoteNeeds;
    }
  | {
      type: "update";
      index: number;
      getValue: (prev: NoteNeeds) => NoteNeeds;
    }
  | {
      type: "remove";
      index: number;
    };
const Roll: React.FC<Props> = ({ urlRoot, rollId }) => {
  console.log("rerender: Roll");
  const [grid, setGrid] = [Grid.State(), Grid.Dispatch()];
  const [notes, setNotes] = useReducer(
    (state: Array<NoteNeeds>, action: NoteAction) => {
      switch (action.type) {
        case "init":
          return action.value;
        case "add":
          return [...state, action.value];
        case "update":
          return state.map((it, index) =>
            index == action.index ? action.getValue(it) : it
          );
        case "remove":
          return state.filter((_, index) => index != action.index);
      }
    },
    []
  );
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

      typedFetch<{ values: Array<NoteRest> }>(notesUrl).then((result) =>
        setNotes({
          type: "init",
          value: result.values.map<NoteNeeds>((it) => ({
            pos: { x: it.offset, y: it.octave * maxPitch + it.pitch },
            length: 1,
          })),
        })
      );
    });
  }, [rollUrl, setGrid]);

  const putNote = {
    from: PutNote.Contexts.from.State(),
    to: PutNote.Contexts.to.State(),
    event: PutNote.Contexts.event.State(),
    apply: PutNote.Contexts.apply.State(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };
  useEffect(() => {
    if (!putNote.apply) return;
    putNote.setApply(false);

    const event = putNote.event;
    switch (event.type) {
      case "none": {
        break;
      }
      case "fromNote": {
        // update
        setNotes({
          type: "update",
          index: event.index,
          getValue: (prev) => ({ ...prev, pos: putNote.to }),
        });
        break;
      }
      case "fromActionCell": {
        // add
        const from = putNote.from;
        const to = putNote.to;
        const pos = {
          x: Math.min(from.x, to.x),
          y: from.y,
        };
        const length = Math.abs(from.x - to.x) + 1;
        setNotes({ type: "add", value: { pos, length } });
      }
    }
  }, [putNote.apply]);

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
        return <Note key={index} {...{ index, ...it, setNotes }}></Note>;
      })}
    </div>
  );
};

export default Roll;
export type { NoteAction };
