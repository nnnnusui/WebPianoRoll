import React, { useRef, useEffect, useState } from "react";
import { range0to } from "../../range";
import ResizeListener from "./ResizeListener";

const Canvas: React.FC = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = {
    width: 80,
    height: 120,
  };
  const width = 40;
  const height = 20;

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  useEffect(() => {
    console.log(context);
    if (context == null) return;
    drawGrid(context, { width, height }, size);
  }, [canvasRef, canvasSize]);

  return (
    <>
      <ResizeListener setSize={setCanvasSize}/>
      <canvas ref={canvasRef} {...canvasSize}></canvas>
    </>
  );
};
export default Canvas;

type Size = {
  width: number;
  height: number;
};
const drawGrid = (
  context: CanvasRenderingContext2D,
  cellSize: Size,
  quantities: Size
) => {
  const max = {
    width: cellSize.width * quantities.width,
    height: cellSize.height * quantities.height,
  };
  range0to(quantities.width + 1)
    .map((index) => index * cellSize.width)
    .forEach((it) => {
      context.moveTo(it, 0);
      context.lineTo(it, max.height);
    });
  range0to(quantities.height + 1)
    .map((index) => index * cellSize.height)
    .forEach((it) => {
      context.moveTo(0, it);
      context.lineTo(max.width, it);
    });
  context.strokeStyle = "black";
  context.stroke();
};
