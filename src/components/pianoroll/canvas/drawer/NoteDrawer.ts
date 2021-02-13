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
    const pointerIds = idPair.map(([pointerId]) => pointerId)
    const noteIds = idPair.map(([,noteId]) => noteId)
    pointerIds.forEach(id => {
      const applied = action.getApplied(id)
      if (!applied) return;
      drawNote(context, move, cellSize, applied.pos, applied.length, 0.5)
    })
    state.getAll().forEach((it) => {
      if (noteIds.includes(it.id)) return;
      drawNote(context, move, cellSize, it.pos, it.length);
    });
  };
  const drawNote = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size,
    pos: Pos,
    length: number,
    alpha: number = 1.0,
  ) => {
    const start = {
      x: pos.x * cellSize.width - move.x,
      y: pos.y * cellSize.height - move.y,
    };
    const size = {
      width: cellSize.width * length,
      height: cellSize.height,
    };
    context.globalAlpha = alpha;
    context.fillStyle = "orange";
    context.lineWidth = 2;
    context.fillRect(start.x, start.y, size.width, size.height);
    context.strokeRect(start.x, start.y, size.width, size.height);
  };
  return draw;
};
export default NoteDrawer;
