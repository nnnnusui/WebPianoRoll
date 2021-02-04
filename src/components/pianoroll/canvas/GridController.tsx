import React, { useState } from "react";
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

  const note = NotesController();

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
    note.draw(context, move.get, cellSize);
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
    const cellPos = getCellPos(gridLocal);

    const click = {
      left: event.button == 0,
      middle: event.button == 1,
      right: event.button == 2,
    };
    const key = {
      ctrl: event.ctrlKey,
    };
    const primary = event.isPrimary;
    if (false) {
    } else if (click.left && key.ctrl) {
      selection.start(gridLocal);
    } else if (click.left) {
      note.toggle(cellPos);
    } else if (click.middle) {
      move.start(viewLocal);
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
const NotesController = () => {
  const [notes, setNotes] = useState<Pos[]>([]);
  const isEquals = (noteA: Pos, noteB: Pos) =>
    noteA.x == noteB.x && noteA.y == noteB.y;
  const exists = (note: Pos) => notes.find((it) => isEquals(it, note)) != null;
  const add = (note: Pos) => {
    setNotes((prev) => [...prev.filter((it) => !isEquals(it, note)), note]);
  };
  const remove = (note: Pos) => {
    setNotes((prev) => prev.filter((it) => !isEquals(it, note)));
  };
  const toggle = (note: Pos) => {
    if (exists(note)) remove(note);
    else add(note);
  };

  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    notes.forEach((note) => {
      const start = {
        x: note.x * cellSize.width - move.x,
        y: note.y * cellSize.height - move.y,
      };
      context.fillRect(start.x, start.y, cellSize.width, cellSize.height);
    });
  };
  return {
    add,
    remove,
    toggle,
    draw,
  };
};
