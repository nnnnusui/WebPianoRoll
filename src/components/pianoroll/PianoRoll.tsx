import React, { ReactElement } from "react";
import Canvas from "../Canvas";
import RollState from "./state/RollState";
import GridState from "./state/GridState";

const PianoRoll: React.FC = (): ReactElement => {
  const roll = RollState();
  const gridSize = roll.get(0)!;
  const grid = GridState(gridSize);

  const useCanvas = (canvas: HTMLCanvasElement) => {
    const cellSize = {
      width: canvas.width / gridSize.width,
      height: canvas.height / gridSize.height,
    };

    const context = canvas.getContext("2d")!;
    grid.draw(context, { x: 0, y: 0 }, cellSize);
    context.fillRect(100, 100, 200, 200);
    // window.requestAnimationFrame(() => useCanvas(canvas))
  };

  return <Canvas useCanvas={useCanvas} />;
};
export default PianoRoll;
