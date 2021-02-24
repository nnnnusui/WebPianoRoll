import React, { ReactElement, useEffect } from "react";
import Canvas from "../Canvas";
import useRollState from "./state/useRollState";
import useGridState from "./state/useGridState";
import useMoveState from "./state/useMoveState";
import useScaleState from "./state/useScaleState";
import GridDrawer from "./drawer/GridDrawer";
import Distributor, { usePointerState } from "../pointerAction/Distributor";

const PianoRoll: React.FC = (): ReactElement => {
  const roll = useRollState();
  const gridSize = roll.get(0)!;
  const grid = useGridState(gridSize);
  const scale = useScaleState(grid);
  const move = useMoveState(grid, scale);

  const drawer = {
    grid: GridDrawer(grid, move, scale).draw,
  };

  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();
    const setPrevent = (eventName: keyof WindowEventMap) =>
      window.addEventListener(eventName, prevent, { passive: false });
    setPrevent("wheel");
    setPrevent("touchmove");
  }, []);

  const pointers = usePointerState();
  const pointerAction = Distributor(pointers);
  const onWheel = (event: React.WheelEvent) => {
    const vector = event.altKey
      ? { x: 0, y: event.deltaY * 0.01 }
      : { y: 0, x: event.deltaY * 0.01 * 4 };

    if (event.ctrlKey)
      scale.set((prev) => ({
        width: prev.width + vector.x * -1,
        height: prev.height + vector.y * -1,
      }));
    else move.set((prev) => ({ x: prev.x + vector.x, y: prev.y + vector.y }));
  };

  const canvasProps = {
    useCanvas: (canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawer.grid(context, canvas);
    },
    attrs: { onWheel, ...pointerAction },
  };
  return (
    <>
      <Canvas {...canvasProps} />
    </>
  );
};
export default PianoRoll;
