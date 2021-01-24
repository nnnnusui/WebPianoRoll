import React, { useEffect, useReducer } from "react";
import Grid from "./contexts/GridContext";
import PutNote from "./contexts/PutNoteContext";
import Note, { NoteNeeds } from "./Note";
import Notes from "./rest/Notes";

type Props = {
  url: string;
  rollId: number;
  maxOffset: number;
  minOctave: number;
  maxOctave: number;
  maxPitch: number;
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
      beforeGridIndex: number;
      getValue: (prev: NoteNeeds) => NoteNeeds;
    }
  | {
      type: "remove";
      gridIndex: number;
    };
const Roll: React.FC<Props> = ({
  url,
  rollId,
  maxOffset,
  minOctave,
  maxOctave,
  maxPitch,
}) => {
  // console.log("rerender: Roll");
  const [setGrid] = [Grid.Dispatch()];
  const octaveRange = maxOctave + 1 - minOctave;
  const height = octaveRange * maxPitch;
  const width = maxOffset;
  const grid = { width, height };
  const noteRest = Notes(`${url}/${rollId}`);
  const [notes, setNotes] = useReducer(
    (state: Array<NoteNeeds>, action: NoteAction) => {
      switch (action.type) {
        case "init":
          return action.value;
        case "add":
          return [...state, action.value];
        case "update":
          return state.map((it) =>
            it.gridIndex == action.beforeGridIndex ? action.getValue(it) : it
          );
        case "remove":
          return state.filter((it) => it.gridIndex != action.gridIndex);
      }
    },
    []
  );
  useEffect(() => {
    setGrid({ width, height });
    noteRest.getAll().then((result) =>
      setNotes({
        type: "init",
        value: result.values.map<NoteNeeds>((it) => {
          const pos = {
            x: it.offset,
            y: (maxOctave - it.octave) * maxPitch + (maxPitch - it.pitch),
          };
          console.log(pos);
          const gridIndex = posToGridIndex(pos);
          console.log(gridIndex);
          console.log(grid.height);
          return { gridIndex, length: 1 };
        }),
      })
    );
  }, [setGrid]);
  const posToGridIndex = (pos: { x: number; y: number }) =>
    pos.x * grid.height + pos.y;
  const gridIndexToPos = (gridIndex: number) => ({
    x: Math.floor(gridIndex / grid.height),
    y: gridIndex % grid.height,
  });
  const getKeysFromPos = (pos: { x: number; y: number }) => {
    const offset = pos.x;
    const octave = maxOctave - Math.floor(pos.y / maxPitch);
    const pitch = maxPitch - (pos.y % maxPitch);
    return { offset, octave, pitch };
  };

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

    const create = (gridIndex: number) => {
      setNotes({ type: "add", value: { gridIndex, length: 0 } });
      const { offset, octave, pitch } = getKeysFromPos(
        gridIndexToPos(gridIndex)
      );
      return noteRest
        .create({ offset, octave, pitch })
        .catch(() => setNotes({ type: "remove", gridIndex: to.gridIndex }));
    };
    const remove = (gridIndex: number) => {
      setNotes({ type: "remove", gridIndex });
      return noteRest.remove(getKeysFromPos(gridIndexToPos(gridIndex)));
    };
    const update = (beforeGridIndex: number, afterGridIndex: number) => {
      // setNotes({ type: "update", beforeGridIndex, getValue: prev=> ({...prev, gridIndex: afterGridIndex}) });
      remove(beforeGridIndex).then(() => create(afterGridIndex));
    };
    switch (from.type) {
      case "ActionCell":
        switch (to.type) {
          case "ActionCell": {
            const fromPos = gridIndexToPos(from.gridIndex);
            const toPos = gridIndexToPos(to.gridIndex);
            const noteStartPos = {
              x: Math.min(fromPos.x, toPos.x),
              y: fromPos.y,
            };
            const gridIndex = posToGridIndex(noteStartPos);
            const length = Math.abs(fromPos.x - toPos.x) + 1;
            create(gridIndex);
            break;
          }
          case "Note":
            break;
        }
        break;
      case "Note":
        switch (to.type) {
          case "ActionCell":
            update(from.gridIndex, to.gridIndex);
            break;
          case "Note":
            if (from.gridIndex == to.gridIndex) remove(to.gridIndex);
            break;
        }
        break;
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
        return <Note key={index} {...{ ...it, gridIndexToPos }}></Note>;
      })}
    </div>
  );
};

export default Roll;
export type { Props as RollProps };
export type { NoteAction };
