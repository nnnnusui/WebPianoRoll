import React, { useRef, useState } from "react";
import ResizeListener from "./ResizeListener";
import Context from "../context/Context";
import GridController from "./GridController";
import { Size } from "./type/Size";

type Props = {};
const Grid: React.FC<Props> = () => {
  const [canvasSize, setCanvasSize] = useState<Size>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  const roll = Context.roll.selected()?.data;

  const forward = () => {
    if (canvasSize == null) return;
    if (canvas == null) return;
    if (context == null) return;
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
