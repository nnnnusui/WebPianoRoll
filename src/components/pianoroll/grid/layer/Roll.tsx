import React, { useEffect, useReducer } from "react";
import Grid from "../../contexts/GridContext";
import PutNote from "../../contexts/PutNoteContext";
import Note, { NoteNeeds } from "../cell/Note";
import NoteRest from "../../rest/NoteRest";
import { range0to } from "../../../range";

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
  const noteRest = NoteRest(`${url}/${rollId}`);
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
            const find = it.gridIndex == action.gridIndex;
            if (find) action.useValue(it);
            return !find;
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
        .map((it) => ({
          sticky: it.sticky,
          childRollId: it.childRollId,
          pos: {
            x: it.offset,
            y: (maxOctave - it.octave) * maxPitch + (maxPitch - it.pitch - 1),
          },
        }))
        .reduce(
          (sum, it) => {
            if (!sum.beforeSticky || sum.pos.y != it.pos.y) {
              const gridIndex = posToGridIndex(sum.pos);
              return {
                store: [
                  ...sum.store,
                  {
                    gridIndex,
                    length: sum.length,
                    childRollId: it.childRollId,
                  },
                ],
                pos: it.pos,
                length: 1,
                beforeSticky: it.sticky,
                childRollId: it.childRollId,
              };
            }
            const length = sum.length + 1;
            return {
              ...sum,
              length,
              beforeSticky: it.sticky,
              childRollId: it.childRollId,
            };
          },
          {
            store: [],
            pos: { x: -1, y: -1 },
            length: 0,
            childRollId: null,
            beforeSticky: false,
          } as {
            store: Array<NoteNeeds>;
            pos: { x: number; y: number };
            length: number;
            childRollId: number | null;
            beforeSticky: boolean;
          }
        );
      const last: NoteNeeds = {
        gridIndex: posToGridIndex(reduced.pos),
        length: reduced.length,
        childRollId: reduced.childRollId,
      };
      const values = [...reduced.store, last].slice(1);
      setNotes({
        type: "init",
        value: values,
      });
    });
  }, [setGrid, rollId]);
  const posToGridIndex = (pos: { x: number; y: number }) =>
    pos.x * grid.height + pos.y;
  const gridIndexToPos = (gridIndex: number) => ({
    x: Math.floor(gridIndex / grid.height),
    y: gridIndex % grid.height,
  });
  const getKeysFromPos = (pos: { x: number; y: number }) => {
    const offset = pos.x;
    const octave = maxOctave - Math.floor(pos.y / maxPitch);
    const pitch = maxPitch - (pos.y % maxPitch) - 1;
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
    const gridIndexesFromLength = (gridIndex: number, length: number) =>
      range0to(length).map((index) => gridIndex + index * grid.height);

    const create = (
      beforeGridIndex: number,
      afterGridIndex: number,
      childRollId: number | null = null
    ) => {
      const fromPos = gridIndexToPos(beforeGridIndex);
      const toPos = gridIndexToPos(afterGridIndex);
      const noteStartPos = {
        x: Math.min(fromPos.x, toPos.x),
        y: fromPos.y,
      };
      const gridIndex = posToGridIndex(noteStartPos);
      const length = Math.abs(fromPos.x - toPos.x) + 1;
      const noteGridIndexes = gridIndexesFromLength(gridIndex, length);
      const noteKeys = noteGridIndexes.map((gridIndex) =>
        getKeysFromPos(gridIndexToPos(gridIndex))
      );
      const noteCreateRequests = noteKeys
        .slice(0, -1)
        .map((noteKeys) => ({ ...noteKeys, sticky: true, childRollId }))
        .concat([{ ...noteKeys.slice(-1)[0], sticky: false, childRollId }]);
      return noteRest.create(noteCreateRequests).then(() =>
        setNotes({
          type: "add",
          value: { gridIndex, length: length, childRollId },
        })
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
    console.log(`${from.type}, ${to.type}`);
    if (from.type == "ActionCell")
      if (to.type == "ActionCell") create(from.gridIndex, to.gridIndex);
    if (from.type == "Note")
      if (to.type == "Note")
        if (from.gridIndex == to.gridIndex) remove(to.gridIndex);
    if (from.type == "Note")
      if (to.type == "ActionCell") update(from.gridIndex, to.gridIndex);
    if (from.type == "RollList")
      if (to.type == "ActionCell")
        create(to.gridIndex, to.gridIndex, from.rollId);
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
