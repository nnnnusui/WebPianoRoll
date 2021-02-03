import React, { useState } from "react";
import { range0to } from "../../range";
import ScaleController from "./controller/ScaleController";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";

type Props = {
  context: CanvasRenderingContext2D;
  canvasSize: Size;
  gridSize: Size;
};
const GridController: React.FC<Props> = ({ context, canvasSize, gridSize }) => {
  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const scale = ScaleController(maxPos, 10, 0.5);
  const move = scale.move;
  const selection = SelectionController();

  const cellSize = {
    width: (canvasSize.width / gridSize.width) * scale.state,
    height: (canvasSize.height / gridSize.height) * scale.state,
  };
  const getCellPos = (viewLocal: Pos): Pos => {
    const gridLocal = {
      x: move.state.x + viewLocal.x,
      y: move.state.y + viewLocal.y,
    };
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };

  const draw = () => {
    context.beginPath();
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.save();

    drawGrid(context, move.state, cellSize, gridSize);
    drawRect(context, move.state, selection.state, cellSize);
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
        const cellPos = getCellPos(mouse);
        selection.start(cellPos);
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
    const cellPos = getCellPos(mouse);
    selection.middle(cellPos);
  };
  const onPointerUp = (event: React.PointerEvent) => {
    move.end();
    selection.end();
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
export default GridController;

const drawRect = (
  context: CanvasRenderingContext2D,
  start: Pos,
  range: { from: Pos; to: Pos },
  cellSize: Size
) => {
  const { from, to } = range;
  const rect = {
    pos: {
      x: Math.min(from.x, to.x) * cellSize.width - start.x,
      y: Math.min(from.y, to.y) * cellSize.height - start.y,
    },
    size: {
      width: (Math.abs(to.x - from.x) + 1) * cellSize.width,
      height: (Math.abs(to.y - from.y) + 1) * cellSize.height,
    },
  };
  context.fillRect(rect.pos.x, rect.pos.y, rect.size.width, rect.size.height);
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
