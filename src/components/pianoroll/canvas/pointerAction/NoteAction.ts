import MoveState from "../../state/MoveState";
import NoteState from "../state/NoteState";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";
import { PointerActionExecutorOverride } from "../../../pointerAction/Executor";
import Event from "../../../pointerAction/type/Event";

const NoteAction = (
  state: ReturnType<typeof NoteState>,
  move: ReturnType<typeof MoveState>,
  cellSize: Size
): PointerActionExecutorOverride => {
  type NoteId = number;

  const getCellPos = (gridLocal: Pos): Pos => {
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };

  type Note = { pos: Pos; length: number };
  type Action = {
    result: (events: Event[]) => Note;
    execute: (events: Event[]) => Promise<void>;
    mayBeExecute: (events: Event[]) => void;
    cancel: () => void;
  };

  const AddAction = (from: Pos): Action => {
    const result = (events: Event[]) => {
      const [event] = events;
      const to = getCellPos(move.getGridLocal(event));
      const xDiff = to.x - from.x;
      const pos = { ...from, x: Math.min(from.x + xDiff, from.x) };
      const length = Math.abs(xDiff) + 1;
      return { pos, length };
    };

    return {
      result,
      execute: (events: Event[]) => state.add(result(events)),
      mayBeExecute: () => {},
      cancel: () => {},
    };
  };
  const MoveAction = (from: Pos, noteId: NoteId): Action => {
    const target = state.get(noteId)!;
    const result = (events: Event[]) => {
      const [event] = events;
      const to = getCellPos(move.getGridLocal(event));
      const vector = {
        x: to.x - from.x,
        y: to.y - from.y,
      };
      return {
        ...target,
        pos: {
          x: target.pos.x + vector.x,
          y: target.pos.y + vector.y,
        },
      };
    };
    return {
      result,
      execute: (events: Event[]) => state.set(noteId, result(events)),
      mayBeExecute: () => {},
      cancel: () => {},
    };
  };
  const RemoveAction = (noteId: NoteId, note: Note): Action => {
    return {
      result: () => note,
      execute: () => state.delete(noteId),
      mayBeExecute: () => {},
      cancel: () => {},
    };
  };

  const MoveOrRemoveAction = (
    from: Pos,
    noteId: NoteId,
    note: Note
  ): Action => {
    const moveAction = MoveAction(from, noteId);
    const removeAction = RemoveAction(noteId, note);
    let action = removeAction;
    return {
      result: (events) => action.result(events),
      execute: (events: Event[]) => action.execute(events),
      mayBeExecute: (events: Event[]) => {
        action.mayBeExecute(events);
        const [event] = events;
        const to = getCellPos(move.getGridLocal(event));
        if (from?.x != to?.x || from?.y != to?.y) action = moveAction;
      },
      cancel: () => {},
    };
  };

  return {
    type: "note",
    executor: (events) => {
      const [event] = events;
      const pointerId = event.pointerId;
      const from = getCellPos(move.getGridLocal(event));
      const alreadyExists = state.getExistsOn(from);
      const action = (() => {
        if (alreadyExists.length <= 0) {
          return AddAction(from);
        } else {
          const [note] = alreadyExists;
          state.onAction.set(pointerId, note.id);
          return MoveOrRemoveAction(from, note.id, note);
        }
      })();
      state.maybe.set(pointerId, action.result(events));

      return {
        execute: (events) => {
          action.execute(events).finally(() => {
            state.maybe.delete(pointerId);
            state.onAction.delete(pointerId);
          });
        },
        mayBeExecute: (events) => {
          action.mayBeExecute(events);
          state.maybe.set(pointerId, action.result(events));
        },
        cancel: () => {
          state.maybe.delete(pointerId);
          state.onAction.delete(pointerId);
        },
      };
    },
  };
};
export default NoteAction;
