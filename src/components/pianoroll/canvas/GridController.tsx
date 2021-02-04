import React from "react";
import { range0to } from "../../range";
import ScaleController from "./controller/ScaleController";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";
import MoveController from "./controller/MoveController";

type Props = {
  context: CanvasRenderingContext2D;
  canvasSize: Size;
  gridSize: Size;
};
const GridController: React.FC<Props> = ({ context, canvasSize, gridSize }) => {
  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const move = MoveController(maxPos);
  const scale = ScaleController(move, 10, 0.5);
  const selection = SelectionController();

  const cellSize = {
    width: (canvasSize.width / gridSize.width) * scale.get,
    height: (canvasSize.height / gridSize.height) * scale.get,
  };
  const getCellPos = (gridLocal: Pos): Pos => {
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };

  const draw = () => {
    context.beginPath();
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.save();

    drawGrid(context, move.get, cellSize, gridSize);
    selection.draw(context, move.get);
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
  const getGridLocalMousePosFromEvent = (event: React.MouseEvent) => {
    const elementLocal = getElementLocalMousePosFromEvent(event)
    return {
      x: move.get.x + elementLocal.x,
      y: move.get.y + elementLocal.y,
    }
  }

  const onPointerDown = (event: React.PointerEvent) => {
    const viewLocal = getElementLocalMousePosFromEvent(event);
    const gridLocal = getGridLocalMousePosFromEvent(event);
    switch (event.button) {
      case 0:
        selection.start(gridLocal);
        break;
      case 1:
        move.start(viewLocal);
        break;
      case 2:
        break;
    }
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const viewLocal = getElementLocalMousePosFromEvent(event);
    const gridLocal = getGridLocalMousePosFromEvent(event);
    move.middle(viewLocal, scale.get);
    selection.middle(gridLocal);
  };
  const onPointerUp = (event: React.PointerEvent) => {
    move.end();
    selection.end();
  };
  const onWheel = (event: React.WheelEvent) => {
    const scaleIn = event.deltaY > 0;
    const viewLocal = getElementLocalMousePosFromEvent(event);
    scale.set(scaleIn, viewLocal);
  };
  return (
    <div
      className="absolute h-full w-full"
      {...{ onPointerDown, onPointerMove, onPointerUp, onWheel }}
    ></div>
  );
};
export default GridController;

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
    .map((it) => it - start.x)
    .forEach((it) => {
      context.moveTo(it, 0);
      context.lineTo(it, max.height);
    });
  range0to(quantities.height + 1)
    .map((index) => index * cellSize.height)
    .map((it) => it - start.y)
    .forEach((it) => {
      context.moveTo(0, it);
      context.lineTo(max.width, it);
    });
  context.strokeStyle = "black";
  context.stroke();
};
