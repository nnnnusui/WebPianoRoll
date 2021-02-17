import { range0to } from "../../range";
import MoveState from "./MoveState";
import { Pos } from "../canvas/type/Pos";
import { Size } from "../canvas/type/Size";

const GridState = (size: Size) => {
  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    const max = {
      width: cellSize.width * size.width,
      height: cellSize.height * size.height,
    };
    const beatDenominator = 4;
    const beatNumerator = 4;
    const lineInterval = beatDenominator;
    const barInterval = beatDenominator * beatNumerator;
    range0to(size.width + 1).forEach((index) => {
      if (index % lineInterval != 0) return;
      const gridLocal = index * cellSize.width;
      const viewLocal = gridLocal - move.x * cellSize.width;
      context.moveTo(viewLocal, 0);
      context.lineTo(viewLocal, max.height);
      if (index % barInterval != 0) return;
      if (index % (barInterval * 2) < 16) context.fillStyle = "#222222";
      else context.fillStyle = "#303030";
      context.fillRect(viewLocal, 0, cellSize.width * 16, max.height);
    });
    context.fillStyle = "#331111";
    range0to(size.height + 1).forEach((index) => {
      const gridLocal = index * cellSize.height;
      const viewLocal = gridLocal - move.y * cellSize.height;
      const it = viewLocal;
      context.moveTo(0, it);
      context.lineTo(max.width, it);
      if (index % 12 != 11) return;
      context.fillRect(0, viewLocal, max.width, cellSize.height);
    });
    context.stroke();
  };
  return { size, draw };
};
export default GridState;
