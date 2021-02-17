import React, { ReactElement } from "react";
import Canvas from "../Canvas";
import useRollState from "./state/useRollState";
import GridState from "./state/GridState";
import MoveState from "./state/MoveState";

const PianoRoll: React.FC = (): ReactElement => {
  const roll = useRollState();
  const gridSize = roll.get(0)!;
  const cellSize = {
    width: gridSize.width,
    height: gridSize.height,
  };
  const grid = GridState(gridSize);
  const move = MoveState();

  const useCanvas = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d")!;
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw(context, move.get, cellSize);
  };

  const onWheel = (event: React.WheelEvent) => {
    const vector = event.deltaY / 100;
    move.set((prev) => ({ ...prev, x: prev.x + vector }));
  };

  return (
    <>
      <Canvas useCanvas={useCanvas} deps={[move]} />
      <div className="absolute h-full w-full" onWheel={onWheel} />
    </>
  );
};
export default PianoRoll;
