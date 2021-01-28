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
      const values: NoteNeeds[] = result.map((it) => {
        const pos = {
          x: it.offset,
          y: (maxOctave - it.octave) * maxPitch + (maxPitch - it.pitch - 1),
        };
        const gridIndex = posToGridIndex(pos);
        const length = it.length;
        const childRollId = it.childRollId;
        return { id: it.id, gridIndex, length, childRollId };
      });
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
  const getNoteRestValuesFromPos = (pos: { x: number; y: number }) => {
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
    setSelectedRollId: PutNote.Contexts.selectedRollId.Dispatch(),
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
      const notePosition = getNoteRestValuesFromPos(gridIndexToPos(gridIndex));
      const request = { ...notePosition, length, childRollId };
      return noteRest.create(request).then((result) =>
        setNotes({
          type: "add",
          value: { gridIndex, length: length, childRollId, id: result.id },
        })
      );
    };
    const remove = (gridIndex: number) => {
      setNotes({
        type: "remove",
        gridIndex,
        useValue: (note) => noteRest.remove({ id: note.id }),
      });
    };
    const update = (beforeGridIndex: number, afterGridIndex: number) => {
      // const fromPos = gridIndexToPos(beforeGridIndex);
      // const toPos = gridIndexToPos(afterGridIndex);
      // setNotes({ type: "update", beforeGridIndex, getValue: prev=> {
      //   // if(fromPos.x + prev.length > toPos.x) return prev;
      //   const toForward = fromPos.x < toPos.x
      //   const x = toForward ? {
      //     start: fromPos.x + prev.length,
      //     end: toPos.x
      //   } : {
      //     start: toPos.x,
      //     end: fromPos.x - 1
      //   }
      //   if (toForward && x.end < fromPos.x + prev.length) return prev;
      //   create(posToGridIndex({x: x.start, y: fromPos.y}), posToGridIndex({x: x.end, y: fromPos.y}))
      //   // const noteStartPos = {
      //   //   x: Math.min(fromPos.x, toPos.x),
      //   //   y: fromPos.y,
      //   // };
      //   return {gridIndex: posToGridIndex({x: x.start, y: fromPos.y}), length: x.end - x.start + prev.length}
      // } });
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
    if (from.type == "RollList")
      if (to.type == "RollList")
        if (from.rollId == to.rollId) putNote.setSelectedRollId(to.rollId);
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
      {notes.map((note) => {
        return <Note key={note.id} {...{ ...note, gridIndexToPos }}></Note>;
      })}
    </div>
  );
};

export default Roll;
export type { Props as RollProps };
export type { NoteAction };
