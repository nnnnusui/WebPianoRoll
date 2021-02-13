import Context from "../../context/Context";
import { NoteRestData } from "../../rest/Note";
import { Pos } from "../type/Pos";
import useMapState from "../useMapState";

const NoteState = () => {
  const roll = Context.roll.selected()?.data;
  const notes = Context.notes.State();
  const notesAction = Context.notes.Dispatch();

  type NoteId = number;
  const onActionMap = useMapState<NoteId>();

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

  const get = (() => {
    if (roll == null) return [];
    const values = notes.get(roll.id)?.values();
    if (values == null) return [];
    return Array.from(values);
  })();

  return {
    get,
    add,
    move,
    remove,
    getAlreadyExists,
    getPosFromNoteData,
    onActionMap,
  };
};
export default NoteState;
