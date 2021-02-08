import React, { useRef, useState } from "react";
import ResizeListener from "../grid/ResizeListener";
import Context from "../context/Context";
import GridController from "./GridController";
import { Size } from "./type/Size";

type Props = {};
const Grid: React.FC<Props> = () => {
  const [canvasSize, setCanvasSize] = useState<Size>();
  const [leftHeaderSize, setLeftHeaderSize] = useState<Size>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  const roll = Context.roll.selected()?.data;

  const forward = () => {
    if (canvasSize == null) return;
    if (leftHeaderSize == null) return;
    if (canvas == null) return;
    if (context == null) return;
    const gridSize = {
      width: roll?.width || 32,
      height: roll?.height || 12,
    };
    return (
      <GridController {...{ context, gridSize, canvasSize, leftHeaderSize }} />
    );
  };

  return (
    <>
      <ResizeListener setSize={setCanvasSize}>
        <div className="h-full w-full flex">
          <div className="relative h-full w-5">
            <ResizeListener setSize={setLeftHeaderSize} />
          </div>
          <div className="relative h-full w-full">
            <ResizeListener setSize={() => {}} />
          </div>
        </div>
      </ResizeListener>
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
