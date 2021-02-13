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
    state.get.forEach(({ data }) => {
      action;
      const pos = state.getPosFromNoteData(data);

      drawNote(context, move, cellSize, pos, data.length);
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
