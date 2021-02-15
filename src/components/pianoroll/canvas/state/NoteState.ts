import Context from "../../context/Context";
import { NoteRestData } from "../../rest/Note";
import { Pos } from "../type/Pos";
import useMapState from "../useMapState";
import PointerId from "../type/PointerId";

type NoteId = number;
type Note = {
  pos: Pos;
  length: number;
};
const NoteState = () => {
  const roll = Context.roll.selected()?.data;
  const notes = Context.notes.State();
  const notesAction = Context.notes.Dispatch();

  const maybe = useMapState<PointerId, Note>();
  const onAction = useMapState<PointerId, NoteId>();

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

  const getAll = () => {
    if (!roll) return [];
    const values = notes.get(roll.id)?.values();
    if (!values) return [];
    return Array.from(values).map(({ data }) => ({
      id: data.id,
      pos: getPosFromNoteData(data),
      length: data.length,
    }));
  };

  const getAlreadyExists = (pos: Pos) => {
    return getAll()
      .reverse()
      .filter((note) => {
        const range = {
          start: note.pos,
          end: { x: note.pos.x + note.length, y: note.pos.y + 1 },
        };
        const include = {
          x: range.start.x <= pos.x && pos.x < range.end.x,
          y: range.start.y <= pos.y && pos.y < range.end.y,
        };
        return include.x && include.y;
      });
  };

  return {
    get: (noteId: NoteId) => {
      const data = notes.get(roll!.id)?.get(noteId)?.data;
      if (!data) return;
      return {
        id: data.id,
        pos: getPosFromNoteData(data),
        length: data.length,
      };
    },
    add: (note: Note) => {
      const request = {
        ...getNoteRestDataFromPos(note.pos)!,
        length: note.length,
        childRollId: null,
      };
      notesAction({ type: "create", rollId: roll!.id, request });
    },
    set: (noteId: NoteId, note: Note) => {
      const before = notes.get(roll!.id)?.get(noteId)
      const request = {
        id: noteId,
        ...getNoteRestDataFromPos(note.pos)!,
        length: note.length,
        childRollId: before?.data.childRollId ||  null,
      };
      notesAction({ type: "update", rollId: roll!.id, request });
    },
    delete: (noteId: NoteId) => {
      notesAction({
        type: "delete",
        rollId: roll!.id,
        request: { id: noteId },
      });
    },
    getAll,
    getAlreadyExists,
    maybe,
    onAction,
  };
};
export default NoteState;
export type {Note}
