import { useState } from "react";
import { Pos } from "../type/Pos";
import useMapState from "../useMapState";

const NoteState = () => {
  type NoteId = number;
  type Note = {
    pos: Pos;
    length: number;
  };
  const [id, setId] = useState<NoteId>(0);
  const autoIncrement = (action: (next: NoteId) => void) =>
    setId((prev) => {
      const next = prev + 1;
      action(next);
      return next;
    });

  const noteMap = useMapState<NoteId, Note>();
  const getAll = () =>
    Array.from(noteMap.state).map(([id, note]) => ({ ...note, id }));

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
    ...noteMap,
    add: (note: Note) => autoIncrement((next) => noteMap.set(next, note)),
    getAll,
    getAlreadyExists,
  };
};
export default NoteState;
