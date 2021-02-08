import Context from "../../context/Context";
import { useState } from "react";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";
import { NoteRestData } from "../../rest/Note";

const NotesController = () => {
  const roll = Context.roll.selected()?.data;
  const notes = Context.notes.State();
  const notesAction = Context.notes.Dispatch();

  const initDiff = 0;
  const initFrom = { x: 0, y: 0 };
  const [xDiff, setXDiff] = useState(initDiff);
  const [from, setFrom] = useState(initFrom);
  const [on, setOn] = useState(false);

  const getNoteRestDataFromPos = (pos: { x: number; y: number }) => {
    const offset = pos.x;
    const octave = roll!.maxOctave - Math.floor(pos.y / roll!.maxPitch);
    const pitch = roll!.maxPitch - (pos.y % roll!.maxPitch) - 1;
    return { offset, octave, pitch };
  };
  const getPosFromNoteData = (data: NoteRestData) => ({
    x: data.offset,
    y:
      (roll!.maxOctave - data.octave) * roll!.maxPitch +
      (roll!.maxPitch - data.pitch - 1),
  });

  const start = (from: Pos) => {
    setFrom(from);
    setOn(true);
  };
  const middle = (to: Pos) => {
    if (!on) return;
    setXDiff(to.x - from.x);
  };
  const end = () => {
    const prevOn = on;
    setOn(false);
    setXDiff(initDiff);
    if (!prevOn) return;
    if (roll == null) return;
    const pos = { ...from, x: Math.min(from.x + xDiff, from.x) };
    const note = {
      ...getNoteRestDataFromPos(pos)!,
      length: Math.abs(xDiff) + 1,
      childRollId: null,
    };
    notesAction({ type: "create", rollId: roll.id, request: note });
  };
  const remove = (target: Pos) => {
    if (roll == null) return;
    const values = notes.get(roll.id)?.values();
    if (values == null) return;
    Array.from(values)
      .filter((it) => {
        const itPos = getPosFromNoteData(it.data);
        const itRange = {
          start: itPos,
          end: { ...itPos, x: itPos.x + it.data.length },
        };
        const include = {
          x: itRange.start.x <= target.x && target.x <= itRange.end.x,
          y: itRange.start.y <= target.y && target.y <= itRange.end.y,
        };
        console.log(target);
        return include.x && include.y;
      })
      .forEach((it) =>
        notesAction({
          type: "delete",
          rollId: roll.id,
          request: { id: it.data.id },
        })
      );
  };

  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    if (on) {
      const noteFrom = { ...from, x: Math.min(from.x + xDiff, from.x) };
      drawNote(context, move, cellSize, noteFrom, Math.abs(xDiff) + 1);
    }
    if (roll == null) return;
    notes.get(roll.id)?.forEach(({ data }) => {
      const pos = getPosFromNoteData(data);
      drawNote(context, move, cellSize, pos, data.length);
    });
  };
  const drawNote = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size,
    note: Pos,
    length: number
  ) => {
    const start = {
      x: note.x * cellSize.width - move.x,
      y: note.y * cellSize.height - move.y,
    };
    const size = {
      width: cellSize.width * length,
      height: cellSize.height,
    };
    context.fillStyle = "orange";
    context.lineWidth = 2;
    context.fillRect(start.x, start.y, size.width, size.height);
    context.strokeRect(start.x, start.y, size.width, size.height);
  };

  return {
    start,
    middle,
    end,
    remove,
    draw,
  };
};
export default NotesController;
