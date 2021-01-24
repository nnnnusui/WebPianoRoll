import React, { useEffect, useReducer } from "react";
import typedFetch from "../typedFetch";
import Grid from "./contexts/GridContext";
import PutNote from "./contexts/PutNoteContext";
import Note, { NoteNeeds } from "./Note";
import Notes, { getKeysFromPos } from "./rest/Notes";

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
      gridIndex: number;
      getValue: (prev: NoteNeeds) => NoteNeeds;
    }
  | {
      type: "remove";
      gridIndex: number;
    };
const Roll: React.FC<Props> = ({ urlRoot, rollId }) => {
  console.log("rerender: Roll");
  const maxPitch = 12;
  const rollUrl = `${urlRoot}${rollId}`;
  const noteRest = Notes(rollUrl)
  const [grid, setGrid] = [Grid.State(), Grid.Dispatch()];
  const getPosFromgridIndex = (gridIndex: number) => {
    return {
      x: Math.floor(gridIndex / grid.height),
      y: gridIndex % grid.height,
    };
  }
  const [notes, setNotes] = useReducer(
    (state: Array<NoteNeeds>, action: NoteAction) => {
      switch (action.type) {
        case "init":
          return action.value;
        case "add":
          return [...state, action.value];
        case "update":
          return state.map((it) =>
            it.gridIndex == action.gridIndex ? action.getValue(it) : it
          );
        case "remove":
          return state.filter((it) => it.gridIndex != action.gridIndex);
      }
    },
    []
  );
  useEffect(() => {
    typedFetch<RollRest>(rollUrl).then((result) => {
      const maxOffset = result.division;
      const minOctave = -1;
      const maxOctave = 1;
      const octave = maxOctave + 1 - minOctave;
      const height = octave * maxPitch;
      const width = maxOffset;
      setGrid({ width, height });

      noteRest.getAll().then((result) =>
        setNotes({
          type: "init",
          value: result.values.map<NoteNeeds>((it) => {
            const pos = { x: it.offset,
              y: it.octave * maxPitch + it.pitch }
            const gridIndex = pos.x * grid.height + pos.y
            return {
              gridIndex,
              pos,
              length: 1,
            }
          }),
        })
      );
    });
  }, [rollUrl, setGrid]);

  const putNote = {
    from: PutNote.Contexts.from.State(),
    to: PutNote.Contexts.to.State(),
    apply: PutNote.Contexts.apply.State(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };
  useEffect(() => {
    if (!putNote.apply) return;
    putNote.setApply(false);
    const from = putNote.from;
    const to = putNote.to;

    switch (to.type) {
      case "Note":
        switch (from.type) {
          case "Note":
            if (from.gridIndex != to.gridIndex) break;
            const gridIndex = to.gridIndex
            console.log(gridIndex)
            setNotes({ type: "remove", gridIndex });

            noteRest.remove(getKeysFromPos(getPosFromgridIndex(gridIndex)))
            break;
          case "ActionCell":
            break;
        }
        break;
      case "ActionCell": {
        const toPos = getPosFromgridIndex(to.gridIndex)
        switch (from.type) {
          case "Note":
            // update
            setNotes({
              type: "update",
              gridIndex: from.gridIndex,
              getValue: (prev) => ({ ...prev, pos: toPos }),
            });
            break;
          case "ActionCell": {
            const fromPos = getPosFromgridIndex(from.gridIndex)
            const noteStartPos = {
              x: Math.min(fromPos.x, toPos.x),
              y: fromPos.y,
            };
            const length = Math.abs(fromPos.x - toPos.x) + 1;
            const gridIndex = noteStartPos.x * grid.height + noteStartPos.y
            setNotes({ type: "add", value: { gridIndex, pos: noteStartPos, length } });

            const {offset, octave, pitch} = getKeysFromPos(noteStartPos)
            console.log(fromPos)
            noteRest.create({offset, octave, pitch})
              .catch(it=> setNotes({ type: "remove", gridIndex: to.gridIndex }))
            break;
          }
        }
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
        return <Note key={index} {...it}></Note>;
      })}
    </div>
  );
};


export default Roll;
export type { NoteAction };
