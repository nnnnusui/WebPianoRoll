import { Pos } from "../type/Pos";
import useMapState from "../useMapState";
import PointerId from "../type/PointerId";
import useIdMapState from "../useIdMapState";

type NoteId = number;
type Note = {
  pos: Pos;
  length: number;
};
const NoteState = () => {
  const state = useIdMapState<Note>();
  const maybe = useMapState<PointerId, Note>();
  const onAction = useMapState<PointerId, NoteId>();

  const getExistsOn = (pos: Pos) => {
    return state
      .getAllWithId()
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
    ...state,
    getExistsOn,
    maybe,
    onAction,
  };
};
export default NoteState;
export type { Note };
