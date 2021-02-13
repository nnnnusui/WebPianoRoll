import {
  PointerActionType,
  PointerActionOverride,
} from "../PointerActionConsumer";
import MoveState from "../state/MoveState";
import NoteState from "../state/NoteState";
import PointerId from "../type/PointerId";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";
import useMapState from "../useMapState";

const NoteAction = (
  state: ReturnType<typeof NoteState>,
  move: ReturnType<typeof MoveState>,
  cellSize: Size
): [PointerActionType, PointerActionOverride] => {
  type NoteId = number;
  type Mode = "add" | "remove" | "move" | "moveOrRemove";
  const modeMap = useMapState<PointerId, Mode>();
  const fromMap = useMapState<PointerId, Pos>();
  const toMap = useMapState<PointerId, Pos>();

  const onActionMap = useMapState<PointerId, NoteId>([]);

  const getCellPos = (gridLocal: Pos): Pos => {
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };

  const apply = (id: PointerId) => {
    const mode = modeMap.get(id);
    const from = fromMap.get(id);
    const to = toMap.get(id);
    if (!mode || !from || !to) return;

    switch (mode) {
      case "add": {
        const xDiff = to.x - from.x;
        const pos = { ...from, x: Math.min(from.x + xDiff, from.x) };
        const length = Math.abs(xDiff) + 1;
        state.add(pos, length);
        break;
      }
      case "move": {
        const vector = {
          x: to.x - from.x,
          y: to.y - from.y,
        };
        state.move(from, vector);
        break;
      }
      case "remove":
      case "moveOrRemove": {
        state.remove(to);
        break;
      }
      default:
        break;
    }
  };

  return [
    "note",
    {
      down: (events) => {
        const [event] = events;
        const id = event.pointerId;
        const cell = getCellPos(move.getGridLocal(event));
        const alreadyExists = state.getAlreadyExists(cell);
        const mode = alreadyExists.length <= 0 ? "add" : "moveOrRemove";
        modeMap.set(id, mode);
        fromMap.set(id, cell);
        toMap.set(id, cell);

        if (alreadyExists.length <= 0) return;
        const [note] = alreadyExists;
        onActionMap.set(id, note.data.id);
      },
      move: (events) => {
        const [event] = events;
        const id = event.pointerId;
        const cell = getCellPos(move.getGridLocal(event));
        toMap.set(id, cell);

        if (modeMap.get(id) != "moveOrRemove") return;
        const from = fromMap.get(id);
        const to = toMap.get(id);
        if (from?.x != to?.x || from?.y != to?.y) modeMap.set(id, "move");
      },
      up: (events) => {
        const [event] = events;
        const id = event.pointerId;
        apply(id);
        modeMap.delete(id);
        fromMap.delete(id);
        toMap.delete(id);
        onActionMap.delete(id);
      },
      cancel: (events) => {
        const [event] = events;
        const id = event.pointerId;
        modeMap.delete(id);
        fromMap.delete(id);
        toMap.delete(id);
        onActionMap.delete(id);
      },
    },
  ];
};
export default NoteAction;
