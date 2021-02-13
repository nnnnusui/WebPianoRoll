import NotesController from "../controller/NotesController";
import {
  PointerActionType,
  PointerActionOverride,
} from "../PointerActionConsumer";
import MoveState from "../state/MoveState";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";

const NoteAction = (
  notes: ReturnType<typeof NotesController>,
  move: ReturnType<typeof MoveState>,
  cellSize: Size
): [PointerActionType, PointerActionOverride] => {
  const getCellPos = (gridLocal: Pos): Pos => {
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };
  return [
    "note",
    {
      down: (events) => {
        const [event] = events;
        const cell = getCellPos(move.getGridLocal(event));
        if (!notes.isAlreadyExists(cell)) notes.start("add", cell);
        else notes.start("moveOrRemove", cell);
      },
      move: (events) => {
        const [event] = events;
        const cell = getCellPos(move.getGridLocal(event));
        notes.middle(cell);
      },
      up: () => {
        notes.end();
      },
      cancel: () => {
        notes.cancel();
      },
    },
  ];
};
export default NoteAction;
