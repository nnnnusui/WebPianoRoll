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

  const { draw, getCellPos, move, scale } = GridController(canvasSize, {
    width: 32,
    height: 12,
  });

  const [selection, setSelection] = useState({
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0 },
  });
  const [notes, setNotes] = useState<Pos[]>([]);

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  const roll = Context.roll.selected()?.data;

  const forward = () => {
    if (canvas == null) return;
    if (context == null) return;
    if (roll == null) return;

    window.requestAnimationFrame(() => draw(context));

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
          setSelection((prev) => ({ from: cellPos, to: cellPos }));
          console.log(cellPos);
          setNotes((prev) => {
            const notEqualToCurrent = (it: Pos) =>
              !(it.x == cellPos.x && it.y == cellPos.y);
            return [...prev.filter((it) => notEqualToCurrent(it)), cellPos];
          });
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
      const mouse = getElementLocalMousePosFromEvent(event);
      const cellPos = getCellPos(mouse);
      setSelection((prev) => ({ ...prev, to: cellPos }));
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

const GridController = (canvasSize: Size, size: Size) => {
  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const scale = ScaleController(maxPos, 10, 0.5);
  const move = scale.move;

  const cellSize = {
    width: (canvasSize.width / size.width) * scale.state,
    height: (canvasSize.height / size.height) * scale.state,
  };
  const getCellPos = (viewLocal: Pos): Pos => {
    const gridLocal = {
      x: move.state.x + viewLocal.x,
      y: move.state.y + viewLocal.y,
    };
    console.log(gridLocal)
    return {
      x: Math.floor(gridLocal.x / cellSize.width),
      y: Math.floor(gridLocal.y / cellSize.height),
    };
  };

  const draw = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.save();

    drawGrid(context, move.state, cellSize, {
      ...size,
    });
    // drawRect(context, move.state, selection, cellSize);
    // notes.forEach((note) => {
    //   const start = {
    //     x: note.x * cellSize.width,
    //     y: note.y * cellSize.height,
    //   };
    //   context.fillRect(start.x, start.y, cellSize.width, cellSize.height);
    // });
    context.restore();
  };

  return {
    draw,
    getCellPos,
    move,
    scale,
  };
};

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
