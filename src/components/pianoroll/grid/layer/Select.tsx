import React, { useRef, useState } from "react";
import { range0to } from "../../../range";
import ResizeListener from "../ResizeListener";
import Context from "../../context/Context";

type Props = {
  selection: Selection;
};
const Select: React.FC<Props> = ({ selection }) => {
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
    const bouds = canvas.getBoundingClientRect();
    const innerClickPos = {
      x: event.clientX - bouds.left,
      y: event.clientY - bouds.top,
    };
    return {
      x: Math.floor(innerClickPos.x / cellSize.width),
      y: Math.floor(innerClickPos.y / cellSize.height),
    };
  };

  const draw = () => {
    if (canvas == null) return;
    if (context == null) return;
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSelection(context, cellSize, selection);
  };
  window.requestAnimationFrame(draw);
  return (
    <>
      <ResizeListener setSize={setCanvasSize} />
      <canvas ref={canvasRef} {...canvasSize}></canvas>
    </>
  );
};
export default Select;

export type Selection = {
  from: Pos;
  to: Pos;
};

type Size = {
  width: number;
  height: number;
};
type Pos = {
  x: number;
  y: number;
};
type Rect = {
  pos: Pos;
  size: Size;
};
const drawSelection = (
  context: CanvasRenderingContext2D,
  cellSize: Size,
  selection: Selection
) => {
  const start = {
    x: Math.min(selection.from.x, selection.to.x),
    y: Math.min(selection.from.y, selection.to.y),
  };
  const range = {
    width: Math.abs(selection.from.x - selection.to.x) + 1,
    height: Math.abs(selection.from.y - selection.to.y) + 1,
  };
  const rect = {
    pos: {
      x: start.x * cellSize.width,
      y: start.y * cellSize.height,
    },
    size: {
      width: range.width * cellSize.width,
      height: range.height * cellSize.height,
    },
  };
  drawRect(context, rect);
};
const drawRect = (context: CanvasRenderingContext2D, rect: Rect) => {
  context.fillRect(rect.pos.x, rect.pos.y, rect.size.width, rect.size.height);
};
