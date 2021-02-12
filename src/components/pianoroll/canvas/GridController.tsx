import React, { useState } from "react";
import { range0to } from "../../range";
import ScaleController from "./controller/ScaleController";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";
import MoveController from "./controller/MoveController";
import NotesController from "./controller/NotesController";
import Pointers, { ActionType } from "./Pointers";

type Props = {
  context: CanvasRenderingContext2D;
  canvasSize: Size;
  gridSize: Size;
};
const GridController: React.FC<Props> = ({ context, canvasSize, gridSize }) => {
  const [debug, setDebug] = useState("");

  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const move = MoveController(maxPos);
  const scale = ScaleController(move, { width: 2, height: 2 });
  const note = NotesController();

  const grid = Grid(gridSize);
  const cellSize = {
    width: (canvasSize.width / grid.size.width) * scale.get.width,
    height: (canvasSize.height / grid.size.height) * scale.get.height,
  };

  /* 高度なActionメモ
   * ダブルタップ
   * -> 近い場合 状態を保持
   *   -> 片方を離す -> select
   *   -> 3つ目を置く
   *     -> 横にスライド -> 横scale
   *     -> 縦にスライド -> 縦scale
   * -> scale
   *
   * これをやるには、各Actionの実行状態(actionMap)を
   * ActionConfigParameter#conditions() に渡す必要がある？
   *
   * "select" 0, "doubleTap" 1, "hscale" 2, "vscale" 2, "scale" 1 でいける？
   */
  const getElementLocalMousePosFromEvent = (event: React.PointerEvent) => {
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };
  const getViewlocal = (event: React.PointerEvent) =>
    getElementLocalMousePosFromEvent(event);

  const getGridLocal = (event: React.PointerEvent) => {
    const viewLocal = getViewlocal(event);
    return {
      x: move.get.x + viewLocal.x,
      y: move.get.y + viewLocal.y,
    };
  };

  const action = (type: ActionType, events: React.PointerEvent[]) => {
    switch (type) {
      case "move": {
        return {
          onAdd: () => {
            const [event] = events;
            move.start(getViewlocal(event));
          },
          onUpdate: () => {
            const [event] = events;
            move.middle(getViewlocal(event), scale.get);
          },
          onRemove: () => {
            move.end();
          },
        };
      }
      case "scale": {
        const focusAndRange = (events: React.PointerEvent[]) => {
          const [onMove, focus] = events
            .reverse()
            .map((it) => getViewlocal(it));
          const range = {
            width: Math.abs(onMove.x - focus.x),
            height: Math.abs(onMove.y - focus.y),
          };
          return [focus, range] as const;
        };
        return {
          onAdd: () => {
            const [, range] = focusAndRange(events);
            scale.start(range);
          },
          onUpdate: () => {
            const [focus, range] = focusAndRange(events);
            scale.middle(focus, range);
          },
          onRemove: () => {
            scale.end();
          },
        };
      }
      default: {
        return {
          onAdd: () => {},
          onUpdate: () => {},
          onRemove: () => {},
        };
      }
    }
  };

  const pointers = Pointers(action);

  /* 0 -> 1: put
   * 1 -> 2: scale
   * 1 -> 2 && near: select
   * 2 -> 1: move
   * ...: put
   *
   * put(start: cellPos, middle: cellPos)
   * scale(focus: viewLocal, otherSide: viewLocal)
   * select(start: viewLocal, middle: viewLocal)
   * move(start: viewLocal, middle: (viewLocal, scale))
   */

  const draw = () => {
    context.beginPath();
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.save();

    grid.draw(context, move.get, cellSize);
    note.draw(context, move.get, cellSize);
    context.restore();
  };
  window.requestAnimationFrame(draw);

  const onPointerDown = (event: React.PointerEvent) => {
    pointers.add(event);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    pointers.update(event);
  };
  const onPointerUp = (event: React.PointerEvent) => {
    pointers.remove(event);
  };
  const onPointerCancel = onPointerUp;
  const onPointerOut = onPointerUp;
  const onWheel = (event: React.WheelEvent) => {};
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
        onDragStart={(e) => {
          e.preventDefault();
          return false;
        }}
      ></div>
      <h1>
        {`debug: ${debug} _
      ${Array.from(pointers.state.entries())
        .map(([, { action }], index) => `${index}: ${action}`)
        .join(" ")}`}
      </h1>
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
