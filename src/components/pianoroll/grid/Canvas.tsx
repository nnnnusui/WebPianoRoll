import React, { useRef, useState } from "react";
import { range0to } from "../../range";
import ResizeListener from "./ResizeListener";
import Context from "../context/Context";

const Canvas: React.FC = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  const roll = Context.roll.selected()!.data;
  const cellSize = {
    width: (canvas?.width || 100) / roll.width,
    height: (canvas?.height || 200) / roll.height,
  };
  const getCellFromEvent = (event: React.PointerEvent) => {
    if (canvas == null) return;
    const bouds = canvas.getBoundingClientRect()
    const innerClickPos = {
      x: event.clientX - bouds.left,
      y: event.clientY - bouds.top
    }
    return {
      x: Math.floor(innerClickPos.x / cellSize.width),
      y: Math.floor(innerClickPos.y / cellSize.height),
    }
  }

  const draw = () => {
    if (canvas == null) return;
    if (context == null) return;
    context.beginPath()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    drawGrid(context, cellSize, { ...roll });
  }
  window.requestAnimationFrame(draw);

  const onPointerDown = (event: React.PointerEvent)=> {
    console.log(getCellFromEvent(event))
  }
  const onPointerUp = onPointerDown

  return (
    <>
      <ResizeListener setSize={setCanvasSize}/>
      <canvas ref={canvasRef} {...canvasSize} {...{onPointerDown, onPointerUp}}></canvas>
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
