import React, { ReactElement, useEffect } from "react";
import Canvas from "../Canvas";
import useRollState from "./state/useRollState";
import useGridState from "./state/useGridState";
import useMoveState from "./state/useMoveState";
import useScaleState from "./state/useScaleState";

const PianoRoll: React.FC = (): ReactElement => {
  const roll = useRollState();
  const gridSize = roll.get(0)!;
  const grid = useGridState(gridSize);
  const scale = useScaleState(grid, gridSize);
  const move = useMoveState(grid, scale);

  const useCanvas = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d");
    if (!context) return;
    const cellSize = {
      width: canvas.width / scale.get.width,
      height: canvas.height / scale.get.height,
    };
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw(context, move.get, cellSize);
  };

  const onWheel = (event: React.WheelEvent) => {
    const vector = event.altKey
      ? { x: 0, y: event.deltaY * 0.01 * 4 }
      : { y: 0, x: event.deltaY * 0.01 };

    if (event.ctrlKey)
      scale.set((prev) => ({
        width: prev.width + vector.x * -1,
        height: prev.height + vector.y * -1,
      }));
    else move.set((prev) => ({ x: prev.x + vector.x, y: prev.y + vector.y }));
    return true;
  };

  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();
    const setPrevent = (eventName: keyof WindowEventMap) =>
      window.addEventListener(eventName, prevent, { passive: false });
    setPrevent("wheel");
    setPrevent("touchmove");
  }, []);

  return (
    <>
      <Canvas useCanvas={useCanvas} deps={[move]} />
      <div className="absolute h-full w-full" onWheel={onWheel} />
    </>
  );
};
export default PianoRoll;
