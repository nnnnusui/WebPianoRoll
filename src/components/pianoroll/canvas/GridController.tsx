import React, { useState } from "react";
import { range0to } from "../../range";
import ScaleController from "./controller/ScaleController";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";
import MoveController from "./controller/MoveController";
import NotesController from "./controller/NotesController";

type Props = {
  context: CanvasRenderingContext2D;
  canvasSize: Size;
  gridSize: Size;
};
const GridController: React.FC<Props> = ({ context, canvasSize, gridSize }) => {
  const [debug, setDebug] = useState("");
  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const move = MoveController(maxPos);
  const scale = ScaleController(move, 10);
  const selection = SelectionController();
  const grid = Grid(gridSize);

  const note = NotesController();

  const eventCache = (() => {
    type Target = React.PointerEvent;
    const [cache, setCache] = useState<Map<number, Target>>(
      new Map<number, Target>()
    );
    const add = (event: Target) =>
      setCache((prev) => new Map(prev.set(event.pointerId, event)));
    const update = (event: Target) =>
      setCache((prev) => new Map(prev.set(event.pointerId, event)));
    const remove = (event: Target) =>
      setCache((prev) => {
        prev.delete(event.pointerId);
        return new Map(prev);
      });
    return {
      get: cache,
      add,
      update,
      remove,
    };
  })();

  const cellSize = {
    width: (canvasSize.width / grid.size.width) * scale.get.width,
    height: (canvasSize.height / grid.size.height) * scale.get.height,
  };
  const getCellPos = (gridLocal: Pos): Pos => {
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };
  const getCellTopLeft = (cellPos: Pos): Pos => {
    return {
      x: cellPos.x * cellSize.width,
      y: cellPos.y * cellSize.height,
    };
  };
  const getCellBottomRight = (cellPos: Pos): Pos => {
    return {
      x: (cellPos.x + 1) * cellSize.width,
      y: (cellPos.y + 1) * cellSize.height,
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
    eventCache.add(event);
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
    if (event.pointerType == "touch") {
      if (!note.isAlreadyExists(cellPos)) note.start("add", cellPos);
      else note.start("moveOrRemove", cellPos);
    } else if (click.left && key.ctrl) {
      selection.start(viewLocal);
    } else if (click.left) {
      if (!note.isAlreadyExists(cellPos)) note.start("add", cellPos);
      else note.start("move", cellPos);
    } else if (click.middle) {
      move.start(viewLocal);
    } else if (click.right) {
      note.start("remove", cellPos);
    }
  };
  const onPointerMove = (event: React.PointerEvent) => {
    eventCache.update(event);
    const events = Array.from(eventCache.get.values());
    const viewLocal = getElementLocalMousePosFromEvent(event);
    const gridLocal = getGridLocalPosFromViewLocalPos(viewLocal);
    const cellPos = getCellPos(gridLocal);

    switch (events.length) {
      case 1:
        move.middle(viewLocal, scale.get);
        selection.middle(viewLocal);
        scale.endPinch();
        note.middle(cellPos);
        break;
      case 2:
        move.end();
        note.cancel();
        const [otherSide] = events.filter(
          (it) => it.pointerId != event.pointerId
        );
        const focus = getElementLocalMousePosFromEvent(otherSide);
        const range = {
          width: Math.abs(viewLocal.x - focus.x),
          height: Math.abs(viewLocal.y - focus.y),
        };
        scale.byPinch(focus, range);
        break;
      default:
        break;
    }
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const events = Array.from(eventCache.get.values());
    switch (events.length) {
      case 1:
        move.end();
        selection.end();
        break;
    }
    scale.endPinch();
    eventCache.remove(event);
    note.end();
  };
  const onPointerCancel = onPointerUp;
  const onPointerOut = onPointerUp;
  const onWheel = (event: React.WheelEvent) => {
    const scaleIn = event.deltaY > 0;
    const viewLocal = getElementLocalMousePosFromEvent(event);
    const scalar = 0.5;
    const step = scaleIn ? scalar : -scalar;
    scale.add(viewLocal, { width: step, height: step });
  };
  return (
    <>
      <div
        className="absolute h-full w-full"
        {...{
          onPointerDown,
          onPointerMove,
          onPointerUp,
          onPointerCancel,
          onPointerOut,
          onWheel,
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      ></div>
      <h1>{`debug: ${debug}`}</h1>
    </>
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
    drawCoordinatesText(context, move, cellSize);
  };
  const drawCoordinatesText = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    const padding = {
      x: (cellSize.width / 10) * -1,
      y: (cellSize.height / 10) * -1,
    };

    range0to(size.width + 1)
      .flatMap((column) =>
        range0to(size.height + 1).map((row) => [row, column])
      )
      .forEach(([row, column]) => {
        const start = {
          x: column * cellSize.width - move.x - padding.x,
          y: row * cellSize.height - move.y - padding.y,
        };
        context.fillText(
          `x: ${column}, y: ${row}`,
          start.x,
          start.y,
          cellSize.width
        );
      });
  };
  return { size, draw };
};
