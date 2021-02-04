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
  const grid = Grid(gridSize);

  const cellSize = {
    width: (canvasSize.width / grid.size.width) * scale.get,
    height: (canvasSize.height / grid.size.height) * scale.get,
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

    grid.draw(context, move.get, cellSize);
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
  const getGridLocalPosFromViewLocalPos = (elementLocal: Pos) => {
    return {
      x: move.get.x + elementLocal.x,
      y: move.get.y + elementLocal.y,
    };
  };

  const onPointerDown = (event: React.PointerEvent) => {
    const viewLocal = getElementLocalMousePosFromEvent(event);
    const gridLocal = getGridLocalPosFromViewLocalPos(viewLocal);
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
    const gridLocal = getGridLocalPosFromViewLocalPos(viewLocal);
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

const Grid = (size: Size) => {
  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    const max = {
      width: cellSize.width * size.width,
      height: cellSize.height * size.height,
    };
    range0to(size.width + 1)
      .map((index) => index * cellSize.width)
      .map((it) => it - move.x)
      .forEach((it) => {
        context.moveTo(it, 0);
        context.lineTo(it, max.height);
      });
    range0to(size.height + 1)
      .map((index) => index * cellSize.height)
      .map((it) => it - move.y)
      .forEach((it) => {
        context.moveTo(0, it);
        context.lineTo(max.width, it);
      });
    context.strokeStyle = "black";
    context.stroke();
  };
  return { size, draw };
};
