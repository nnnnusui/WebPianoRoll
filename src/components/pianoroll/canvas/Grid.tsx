import React, { useRef, useState } from "react";
import ResizeListener from "./ResizeListener";
import Context from "../context/Context";
import GridController from "./GridController";

type Props = {};
const Grid: React.FC<Props> = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  const roll = Context.roll.selected()?.data;

  const forward = () => {
    if (canvas == null) return;
    if (context == null) return;
    // if (roll == null) return;
    const gridSize = {
      width: roll?.width || 32,
      height: roll?.height || 12,
    };
    return <GridController {...{ context, canvasSize, gridSize }} />;
  };

  return (
    <>
      <ResizeListener setSize={setCanvasSize} />
      <canvas
        className="pointer-events-none absolute h-full w-full"
        ref={canvasRef}
        {...canvasSize}
      ></canvas>
      {forward() || <></>}
    </>
  );
};
export default Grid;
