import { PointerActionExecutorOverride } from "../../../pointerAction/Executor";
import Event from "../../../pointerAction/type/Event";
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
) => {
  type NoteId = number;
  type Mode = "add" | "remove" | "move" | "moveOrRemove";
  const modeMap = useMapState<PointerId, Mode>();
  const fromMap = useMapState<PointerId, Pos>();
  const toMap = useMapState<PointerId, Pos>();

  const onActionMap = useMapState<PointerId, NoteId | null>([]);

  const getCellPos = (gridLocal: Pos): Pos => {
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };

  const getApplied = (id: PointerId) => {
    const mode = modeMap.get(id);
    const from = fromMap.get(id);
    const to = toMap.get(id);
    if (!mode || !from || !to) return;

    switch (mode) {
      case "add": {
        const xDiff = to.x - from.x;
        const pos = { ...from, x: Math.min(from.x + xDiff, from.x) };
        const length = Math.abs(xDiff) + 1;
        return { pos, length };
      }
      case "move": {
        const noteId = onActionMap.get(id)!;
        const target = state.get(noteId)!;
        const vector = {
          x: to.x - from.x,
          y: to.y - from.y,
        };
        const moved = {
          ...target,
          pos: {
            x: target.pos.x + vector.x,
            y: target.pos.y + vector.y,
          },
        };
        return moved;
      }
      case "remove":
      case "moveOrRemove": {
        return state.get(onActionMap.get(id)!);
      }
      default:
        break;
    }
  };
  const apply = (id: PointerId) => {
    const mode = modeMap.get(id);
    const applied = getApplied(id);
    if (!mode || !applied) return;

    switch (mode) {
      case "add":
        state.add(applied);
        break;
      case "move": {
        const noteId = onActionMap.get(id);
        if (!noteId) return;
        state.set(noteId, applied);
        break;
      }
      case "remove":
      case "moveOrRemove": {
        const noteId = onActionMap.get(id);
        if (!noteId) return;
        state.delete(noteId);
        break;
      }
      default:
        break;
    }
  };

  const NoteAddAction = (events: Event[]) => {
    const [event] = events;
    const from = getCellPos(move.getGridLocal(event));
    state.maybe.set(event.pointerId, { pos: from, length: 1 });
    const result = (event: Event) => {
      const to = getCellPos(move.getGridLocal(event));
      const xDiff = to.x - from.x;
      const pos = { ...from, x: Math.min(from.x + xDiff, from.x) };
      const length = Math.abs(xDiff) + 1;
      const result = { pos, length };
      return result;
    };
    return {
      apply: (events: Event[]) => {
        const [event] = events;
        state.add(result(event));
        state.maybe.delete(event.pointerId);
      },
      mayBe: (events: Event[]) => {
        const [event] = events;
        state.maybe.set(event.pointerId, result(event));
      },
    };
  };

  const override: PointerActionExecutorOverride = {
    type: "note",
    executor: {
      down: (events) => {
        const [event] = events;
        const id = event.pointerId;
        const cell = getCellPos(move.getGridLocal(event));
        const alreadyExists = state.getAlreadyExists(cell);
        const mode = alreadyExists.length <= 0 ? "add" : "moveOrRemove";
        modeMap.set(id, mode);
        fromMap.set(id, cell);
        toMap.set(id, cell);

        const noteId = alreadyExists.length <= 0 ? null : alreadyExists[0].id;
        onActionMap.set(id, noteId);
      },
      move: (events) => {
        const [event] = events;
        const id = event.pointerId;
        const cell = getCellPos(move.getGridLocal(event));
        toMap.set(id, cell);

        if (modeMap.get(id) != "moveOrRemove") return;
        const from = fromMap.get(id);
        const to = cell;
        if (from?.x != to?.x || from?.y != to?.y) {
          console.log(id);
          modeMap.set(id, "move");
        }
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
  };
  return { ...override, getApplied, onActionMap, NoteAddAction };
};
export default NoteAction;
