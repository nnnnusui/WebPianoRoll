import React, { useRef, useState } from "react";
import { range0to } from "../../range";
import ResizeListener from "../grid/ResizeListener";
import Context from "../context/Context";
import { Pos } from "./type/Pos";
import ScaleController from "./controller/ScaleController";

type Props = {};
const Grid: React.FC<Props> = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const scale = ScaleController(maxPos, 10, 0.5);
  const move = scale.move;

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  const roll = Context.roll.selected()?.data;

  const forward = () => {
    if (canvas == null) return;
    if (context == null) return;
    if (roll == null) return;
    const cellSize = {
      width: (canvas.width / roll.width) * scale.state,
      height: (canvas.height / roll.height) * scale.state,
    };
    const getCellPos = (viewLocal: Pos): Pos => {
      const gridLocal = {
        x: move.state.x + viewLocal.x,
        y: move.state.y + viewLocal.y,
      };
      return {
        x: gridLocal.x / cellSize.width,
        y: gridLocal.y / cellSize.height,
      };
    };

    const draw = () => {
      context.beginPath();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      drawGrid(context, { x: -move.state.x, y: -move.state.y }, cellSize, {
        ...roll,
      });
      context.restore();
    };
    window.requestAnimationFrame(draw);

    const getElementLocalMousePosFromEvent = (event: React.MouseEvent) => {
      const element = event.target as HTMLElement;
      const rect = element.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onPointerDown = (event: React.PointerEvent) => {
      const mouse = getElementLocalMousePosFromEvent(event);
      switch (event.button) {
        case 0:
          console.log(getCellPos(mouse));
          break;
        case 1:
          move.start(mouse);
          break;
        case 2:
          break;
      }
    };
    const onPointerMove = (event: React.PointerEvent) => {
      const mouse = getElementLocalMousePosFromEvent(event);
      move.in(mouse);
    };
    const onPointerUp = (event: React.PointerEvent) => {
      move.end();
    };
    const onWheel = (event: React.WheelEvent) => {
      const scaleIn = event.deltaY > 0;
      const mouse = getElementLocalMousePosFromEvent(event);
      scale.set(scaleIn, mouse);
    };
    return (
      <div
        className="absolute h-full w-full"
        {...{ onPointerDown, onPointerMove, onPointerUp, onWheel }}
      ></div>
    );
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

export type Selection = {
  from: Pos;
  to: Pos;
};

type Size = {
  width: number;
  height: number;
};

type Rect = {
  pos: Pos;
  size: Size;
};
const drawGrid = (
  context: CanvasRenderingContext2D,
  start: Pos,
  cellSize: Size,
  quantities: Size
) => {
  const max = {
    width: cellSize.width * quantities.width,
    height: cellSize.height * quantities.height,
  };
  range0to(quantities.width + 1)
    .map((index) => index * cellSize.width)
    .map((it) => it + start.x)
    .forEach((it) => {
      context.moveTo(it, 0);
      context.lineTo(it, max.height);
    });
  range0to(quantities.height + 1)
    .map((index) => index * cellSize.height)
    .map((it) => it + start.y)
    .forEach((it) => {
      context.moveTo(0, it);
      context.lineTo(max.width, it);
    });
  context.strokeStyle = "black";
  context.stroke();
};
