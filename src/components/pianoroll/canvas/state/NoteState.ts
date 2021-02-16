import { Pos } from "../type/Pos";
import useMapState from "../useMapState";
import PointerId from "../type/PointerId";
import useIdMapState from "../useIdMapState";
import RollState from "./RollState";
import Context from "../../context/Context";
import Note from "../../rest/Note";
import { useEffect } from "react";
import Rest from "../../rest/Rest";

type NoteId = number;
type Note = {
  offset: number;
  octave: number;
  pitch: number;
  length: number;
  childRollId?: number;
};
type View = {
  pos: Pos;
  length: number;
};
const NoteState = (
  rollMap: ReturnType<typeof RollState>,
  restRoot: ReturnType<typeof Rest>
) => {
  const rollId = Context.roll.selectedId.State();
  const rollContext = Context.roll.selected();
  const rest = restRoot.note(rollId);
  useEffect(() => {
    rest.getAll().then((it) =>
      state.use((state) => {
        state.clear();
        it.forEach((it) => state.set(it.id, it));
      })
    );
  }, [rollId]);
  const getNoteFromView = (view: View): Note => {
    const { pos, length } = view;
    const roll = rollContext!.data; //rollMap.get(1)!;
    const offset = pos.x;
    const octave = roll.maxOctave - Math.floor(pos.y / roll.maxPitch);
    const pitch = roll.maxPitch - (pos.y % roll.maxPitch) - 1;
    return { offset, octave, pitch, length };
  };
  const getViewFromNote = (note: Note): View => {
    const roll = rollContext!.data; //rollMap.get(1)!;
    return {
      pos: {
        x: note.offset,
        y:
          (roll!.maxOctave - note.octave) * roll!.maxPitch +
          (roll!.maxPitch - note.pitch - 1),
      },
      length: note.length,
    };
  };

  const state = useIdMapState<Note>();
  const maybe = useMapState<PointerId, View>();
  const onAction = useMapState<PointerId, NoteId>();

  const getExistsOn = (pos: Pos) => {
    return state
      .getAllWithId()
      .map((note) => ({ id: note.id, ...getViewFromNote(note) }))
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
    get: (key: NoteId) => {
      const note = state.get(key);
      if (!note) return;
      return getViewFromNote(note);
    },
    add: (value: View) => {
      const note = getNoteFromView(value);
      return rest.create(note).then((it) => state.set(it.id, it));
    },
    set: (key: NoteId, value: View) => {
      const note = getNoteFromView(value);
      return rest
        .update({ id: key, ...note })
        .then((it) => state.set(it.id, it));
    },
    delete: (key: NoteId) =>
      rest.delete({ id: key }).then(() => state.delete(key)),
    forEach: (
      callbackfn: (value: View, key: number, map: Map<number, Note>) => void
    ) =>
      state.forEach((value, key, map) =>
        callbackfn(getViewFromNote(value), key, map)
      ),
    getExistsOn,
    maybe,
    onAction,
  };
};
export default NoteState;
export type { Note };
