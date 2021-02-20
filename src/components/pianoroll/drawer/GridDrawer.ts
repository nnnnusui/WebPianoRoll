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
  const offset = { x: 0, y: 0 };
  const move = moveState.get;
  const scale = scaleState.get;
  const draw = (context: CanvasRenderingContext2D, view: Size) => {
    const background = () => {
      barBackground(context, view);
      octaveBackground(context, view);
    };
    background();
    gridLine(context, view);
  };
  const barBackground = (context: CanvasRenderingContext2D, view: Size) => {
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
      context.fillRect(viewLocal, offset.y, cellSize.width * 16, view.height);
    });
  };
  const octaveBackground = (context: CanvasRenderingContext2D, view: Size) => {
    const cellSize = {
      width: view.width / scale.width,
      height: view.height / scale.height,
    };
    const octaveInterval = 12;

    context.fillStyle = "#331111";
    range0to(scale.height).forEach((index) => {
      const gridLocal = index + move.y;
      const viewLocal = index * cellSize.height;
      if (gridLocal % octaveInterval == octaveInterval - 1)
        context.fillRect(offset.x, viewLocal, view.width, cellSize.height);
    });
  };
  const gridLine = (context: CanvasRenderingContext2D, view: Size) => {
    const cellSize = {
      width: view.width / scale.width,
      height: view.height / scale.height,
    };
    const beatDenominator = 4;
    const lineInterval = beatDenominator;

    context.beginPath();
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
