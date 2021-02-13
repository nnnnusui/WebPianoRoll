import NoteAction from "../pointerAction/NoteAction";
import NoteState from "../state/NoteState";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";

const NoteDrawer = (
  state: ReturnType<typeof NoteState>,
  action: ReturnType<typeof NoteAction>
) => {
  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    const idPair = Array.from(action.onActionMap.state);
    state.getAll().forEach((it) => {
      const usingPointer = idPair.find(([, noteId]) => noteId == it.id)?.[0];
      if (!usingPointer) {
        drawNote(context, move, cellSize, it.pos, it.length);
        return;
      }
      const actionResult = action.getApplied(usingPointer);
      if (!actionResult) return;
      drawNote(context, move, cellSize, actionResult.pos, actionResult.length);
    });
  };
  const drawNote = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size,
    pos: Pos,
    length: number
  ) => {
    const start = {
      x: pos.x * cellSize.width - move.x,
      y: pos.y * cellSize.height - move.y,
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
  return draw;
};
export default NoteDrawer;
