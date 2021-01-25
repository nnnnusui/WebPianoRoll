import React, { useEffect, useReducer } from "react";
import Grid from "./contexts/GridContext";
import PutNote from "./contexts/PutNoteContext";
import Note, { NoteNeeds } from "./Note";
import Notes from "./rest/Notes";
import { range0to } from "../range";

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
      useValue: (it: NoteNeeds) => void;
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
          return state.filter((it) => {
            action.useValue(it);
            return it.gridIndex != action.gridIndex;
          });
      }
    },
    []
  );
  useEffect(() => {
    setGrid({ width, height });
    noteRest.getAll().then((result) => {
      const reduced = result.values
        .sort((a, b) => a.offset - b.offset)
        .sort((a, b) => a.pitch - b.pitch)
        .sort((a, b) => a.octave - b.octave)
        .map((it) => {
          console.log(it);
          return it;
        })
        .map((it) => ({
          sticky: it.sticky,
          pos: {
            x: it.offset,
            y: (maxOctave - it.octave) * maxPitch + (maxPitch - it.pitch),
          },
        }))
        .reduce(
          (sum, it) => {
            if (!sum.beforeSticky || sum.pos.y != it.pos.y) {
              const gridIndex = posToGridIndex(sum.pos);
              return {
                store: [...sum.store, { gridIndex, length: sum.length }],
                pos: it.pos,
                length: 1,
                beforeSticky: it.sticky,
              };
            }
            const length = sum.length + 1;
            return { ...sum, length, beforeSticky: it.sticky };
          },
          {
            store: [],
            pos: { x: -1, y: -1 },
            length: 0,
            beforeSticky: false,
          } as {
            store: Array<NoteNeeds>;
            pos: { x: number; y: number };
            length: number;
            beforeSticky: boolean;
          }
        );
      const last = {
        gridIndex: posToGridIndex(reduced.pos),
        length: reduced.length,
      };
      const values = [...reduced.store, last].slice(1);
      values.forEach((it) => console.log(it));
      setNotes({
        type: "init",
        value: values,
      });
    });
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
    const fromPos = gridIndexToPos(from.gridIndex);
    const toPos = gridIndexToPos(to.gridIndex);
    const gridIndexesFromLength = (gridIndex: number, length: number) =>
      range0to(length).map((index) => gridIndex + index * grid.height);

    const length = Math.abs(fromPos.x - toPos.x) + 1;
    const create = (gridIndex: number) => {
      const noteGridIndexes = gridIndexesFromLength(gridIndex, length);
      const noteKeys = noteGridIndexes.map((gridIndex) =>
        getKeysFromPos(gridIndexToPos(gridIndex))
      );
      const noteCreateRequests = noteKeys
        .slice(0, -1)
        .map((noteKeys) => ({ ...noteKeys, sticky: true }))
        .concat([{ ...noteKeys.slice(-1)[0], sticky: false }]);
      return noteRest
        .create(noteCreateRequests)
        .then(() =>
          setNotes({ type: "add", value: { gridIndex, length: length } })
        );
    };
    const remove = (gridIndex: number) => {
      setNotes({
        type: "remove",
        gridIndex,
        useValue: (note) => {
          gridIndexesFromLength(gridIndex, note.length)
            .map((gridIndex) => getKeysFromPos(gridIndexToPos(gridIndex)))
            .forEach((it) => noteRest.remove(it));
        },
      });
    };
    const update = (beforeGridIndex: number, afterGridIndex: number) => {
      // setNotes({ type: "update", beforeGridIndex, getValue: prev=> ({...prev, gridIndex: afterGridIndex}) });
      // remove(beforeGridIndex).then(() => create(afterGridIndex));
    };
    switch (from.type) {
      case "ActionCell":
        switch (to.type) {
          case "ActionCell": {
            const noteStartPos = {
              x: Math.min(fromPos.x, toPos.x),
              y: fromPos.y,
            };
            const gridIndex = posToGridIndex(noteStartPos);
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
