import Context from "../../context/Context";
import { NoteRestData } from "../../rest/Note";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";

const NoteState = () => {
  const roll = Context.roll.selected()?.data;
  const notes = Context.notes.State();
  const notesAction = Context.notes.Dispatch();

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

  const add = (pos: Pos, length: number) => {
    if (roll == null) return;
    const note = {
      ...getNoteRestDataFromPos(pos)!,
      length,
      childRollId: null,
    };
    notesAction({ type: "create", rollId: roll.id, request: note });
  };
  const move = (from: Pos, vector: Pos) => {
    if (roll == null) return;
    const [{ data: before }] = getAlreadyExists(from);
    const beforePos = getPosFromNoteData(before);
    const afterPos = {
      x: beforePos.x + vector.x,
      y: beforePos.y + vector.y,
    };
    const note = {
      ...before,
      ...getNoteRestDataFromPos(afterPos),
    };
    notesAction({ type: "update", rollId: roll.id, request: note });
  };
  const remove = (pos: Pos) => {
    if (roll == null) return;
    getAlreadyExists(pos).forEach((it) =>
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

  return { draw, add, move, remove, getAlreadyExists };
};
export default NoteState;
