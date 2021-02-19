import useGridState from "../state/useGridState";
import useScaleState from "../state/useScaleState";
import useMoveState from "../state/useMoveState";
import { Size } from "../type/Size";
import { range0to } from "../../range";

const GridDrawer = (
  grid: ReturnType<typeof useGridState>,
  moveState: ReturnType<typeof useMoveState>,
  scaleState: ReturnType<typeof useScaleState>
) => {
  const move = moveState.get;
  const scale = scaleState.get;
  const draw = (context: CanvasRenderingContext2D, view: Size) => {
    const background = () => {
      const cellSize = {
        width: view.width / scale.width,
        height: view.height / scale.height,
      };
      const beatDenominator = 4;
      const beatNumerator = 4;
      const barInterval = beatDenominator * beatNumerator;
      range0to(scale.width).forEach((index) => {
        const gridLocal = index + move.x;
        const viewLocal = index * cellSize.width;
        context.fillStyle =
          gridLocal % (barInterval * 2) < 16 ? "#222222" : "#303030";
        context.fillRect(viewLocal, 0, cellSize.width * 16, view.height);
      });
    };
    background();
    gridLine(context, view);
  };
  const gridLine = (context: CanvasRenderingContext2D, view: Size) => {
    const offset = grid.offset;
    const cellSize = {
      width: view.width / scale.width,
      height: view.height / scale.height,
    };
    const beatDenominator = 4;
    const lineInterval = beatDenominator;

    range0to(scale.width).forEach((index) => {
      if (index % lineInterval != 0) return;
      const viewLocal = index * cellSize.width + offset.x;
      context.moveTo(viewLocal, offset.y);
      context.lineTo(viewLocal, view.height);
    });
    range0to(scale.height).forEach((index) => {
      const viewLocal = index * cellSize.height + offset.y;
      context.moveTo(offset.x, viewLocal);
      context.lineTo(view.width, viewLocal);
    });
    context.stroke();
  };
  return { draw };
};
export default GridDrawer;
