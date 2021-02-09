import Context from "../../context/Context";
import { useState } from "react";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";
import { NoteRestData } from "../../rest/Note";

const NotesController = () => {
  const roll = Context.roll.selected()?.data;
  const notes = Context.notes.State();
  const notesAction = Context.notes.Dispatch();

  type Mode = "add" | "remove" | "move" | "moveOrRemove";
  const initDiff = 0;
  const initPos = { x: 0, y: 0 };
  const [xDiff, setXDiff] = useState(initDiff);
  const [mode, setMode] = useState<Mode>();
  const [from, setFrom] = useState(initPos);
  const [to, setTo] = useState(initPos);
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
  const getAlreadyExists = (pos: Pos) => {
    if (roll == null) return [];
    const values = notes.get(roll.id)?.values();
    if (values == null) return [];
    return Array.from(values).filter(({ data }) => {
      const itPos = getPosFromNoteData(data);
      const itRange = {
        start: itPos,
        end: { x: itPos.x + data.length, y: itPos.y + 1 },
      };
      const include = {
        x: itRange.start.x <= pos.x && pos.x < itRange.end.x,
        y: itRange.start.y <= pos.y && pos.y < itRange.end.y,
      };
      return include.x && include.y;
    });
  };
  const isAlreadyExists = (pos: Pos) => getAlreadyExists(pos).length > 0;

  const getMoved = (before: Pos) => {
    const vector = {
      x: to.x - from.x,
      y: to.y - from.y,
    };
    return {
      x: before.x + vector.x,
      y: before.y + vector.y,
    };
  };

  const add = () => {
    if (roll == null) return;
    const xDiff = to.x - from.x;
    const pos = { ...from, x: Math.min(from.x + xDiff, from.x) };
    const note = {
      ...getNoteRestDataFromPos(pos)!,
      length: Math.abs(xDiff) + 1,
      childRollId: null,
    };
    notesAction({ type: "create", rollId: roll.id, request: note });
  };
  const move = () => {
    if (roll == null) return;
    const [{ data: before }] = getAlreadyExists(from);
    const beforePos = getPosFromNoteData(before);
    const afterPos = getMoved(beforePos);
    const note = {
      ...before,
      ...getNoteRestDataFromPos(afterPos),
    };
    notesAction({ type: "update", rollId: roll.id, request: note });
  };
  const remove = () => {
    if (roll == null) return;
    getAlreadyExists(to).forEach((it) =>
      notesAction({
        type: "delete",
        rollId: roll.id,
        request: { id: it.data.id },
      })
    );
  };

  const start = (mode: Mode, from: Pos) => {
    setMode(mode);
    setFrom(from);
    setTo(from);
    setOn(true);
  };
  const middle = (to: Pos) => {
    if (!on) return;
    setTo(to);
  };
  const cancel = () => setOn(false);
  const end = () => {
    const prevOn = on;
    setOn(false);
    if (!prevOn) return;

    switch (mode) {
      case "add":
        add();
        break;
      case "move":
        move();
        break;
      case "remove":
        if (to.x != from.x || to.y != from.y) break;
        remove();
        break;
      case "moveOrRemove":
        if (to.x != from.x || to.y != from.y) {
          move();
          break;
        }
        remove();
        break;
      default:
        break;
    }
  };

  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    const [nowMove] = on ? getAlreadyExists(from) : [null];
    const nowMovePos = nowMove ? getPosFromNoteData(nowMove.data) : null;
    if (on) {
      switch (mode) {
        case "add": {
          const xDiff = to.x - from.x;
          const notePos = { ...from, x: Math.min(from.x + xDiff, from.x) };
          drawNote(context, move, cellSize, notePos, Math.abs(xDiff) + 1);
          break;
        }
        case "moveOrRemove":
        case "move": {
          if (nowMove == null) break;
          if (nowMovePos == null) break;
          const before = nowMovePos;
          const vector = {
            x: to.x - from.x,
            y: to.y - from.y,
          };
          const after = {
            x: before.x + vector.x,
            y: before.y + vector.y,
          };
          drawNote(context, move, cellSize, after, nowMove.data.length);
          break;
        }
      }
    }
    if (roll == null) return;
    notes.get(roll.id)?.forEach(({ data }) => {
      const pos = getPosFromNoteData(data);
      if (nowMovePos != null)
        if (nowMovePos.x == pos.x && nowMovePos.y == pos.y) return;
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
    cancel,
    end,
    draw,
    isAlreadyExists,
  };
};
export default NotesController;
