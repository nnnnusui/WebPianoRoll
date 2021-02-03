import React, { useRef, useState } from "react";
import { range0to } from "../../../range";
import ResizeListener from "../ResizeListener";
import Context from "../../context/Context";
import Select from "./Select";

type Props = {};

const scaleInfo = {
  max: 10,
  min: 1,
  step: 0.5,
};
const Grid: React.FC<Props> = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scale = ScaleController(
    { x: canvasSize.width, y: canvasSize.height },
    10,
    0.5
  );
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

    const draw = () => {
      context.beginPath();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      // context.scale(1, 1);
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
      move.start(mouse);
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

const ScaleController = (maxPos: Pos, maxCount: number, step: number) => {
  const [scaleCount, setScaleCount] = useState(0);
  const scale = 1 + scaleCount * step;
  const move = MoveController(maxPos, scale);
  const setScale = (scaleIn: boolean, viewLocal: Pos) => {
    const direction = scaleIn ? 1 : -1;
    setScaleCount((prev) => {
      const next = prev + direction;
      const result = scaleIn ? (next > 10 ? 10 : next) : next < 0 ? 0 : next;

      const scaled = next == result;
      const mouse = viewLocal;
      const ratio = {
        width: (move.state.x + mouse.x) / (maxPos.x * scale),
        height: (move.state.y + mouse.y) / (maxPos.y * scale),
      };
      const scalingVector = {
        x: scaleInfo.step * maxPos.x,
        y: scaleInfo.step * maxPos.y,
      };
      const moveVector = {
        x: ratio.width * scalingVector.x * direction,
        y: ratio.height * scalingVector.y * direction,
      };
      if (scaled) {
        const scale = scaleInfo.min + result * scaleInfo.step;
        move.setState((prev) => {
          return {
            scale: scale,
            pos: {
              x: prev.x + moveVector.x,
              y: prev.y + moveVector.y,
            },
          };
        });
      }
      return result;
    });
  };
  return {
    set: setScale,
    state: scale,
    move: move,
  };
};
const MoveController = (max: Pos, scale: number) => {
  const [onMove, setOnMove] = useState(false);
  const [from, setFrom] = useState({ x: 0, y: 0 });
  const [move, setMove] = useState({ x: 0, y: 0 });

  const border = {
    start: { x: 0, y: 0 },
    end: { x: max.x, y: max.y },
  };
  const fixEndExceeded = (pos: Pos, scale: number) => ({
    x: Math.min(border.end.x * scale, pos.x + max.x) - max.x,
    y: Math.min(border.end.y * scale, pos.y + max.y) - max.y,
  });
  const fixStartExceeded = (pos: Pos) => ({
    x: Math.max(border.start.x, pos.x),
    y: Math.max(border.start.y, pos.y),
  });

  const updateMoveState = (
    func: (prev: Pos) => { pos: Pos; scale: number }
  ) => {
    setMove((prev) => {
      const { pos: next, scale } = func(prev);
      return fixStartExceeded(fixEndExceeded(next, scale));
    });
  };

  const moveStart = (viewLocal: Pos) => {
    const global = {
      x: viewLocal.x + move.x,
      y: viewLocal.y + move.y,
    };
    setFrom(global);
    setOnMove(true);
  };
  const moveIn = (pos: Pos) => {
    if (!onMove) return;
    const vector = {
      x: from.x - pos.x,
      y: from.y - pos.y,
    };
    updateMoveState(() => ({ pos: vector, scale }));
  };
  const moveEnd = () => {
    setFrom({ x: 0, y: 0 });
    setOnMove(false);
  };
  return {
    state: move,
    setState: updateMoveState,
    start: moveStart,
    in: moveIn,
    end: moveEnd,
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
type Pos = {
  x: number;
  y: number;
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

const focusScale = (
  context: CanvasRenderingContext2D,
  canvas: Size,
  scale: Size,
  mouse: Pos
) => {
  // 切り抜き領域の幅(sw), 高さ(sh) の計算
  const zoomWidth = canvas.width / scale.width;
  const zoomHeight = canvas.height / scale.height;

  // 切り抜き領域の開始点X座標 (sx) の計算
  const zoomLeft =
    (mouse.x * scaleInfo.step) / (scale.width * (scale.width - scaleInfo.step));
  // const zoomLeft = Math.max(0, Math.min(canvas.width - zoomWidth, zoomLeft));

  // 切り抜き領域の開始点Y座標 (sy) の計算
  const zoomTop =
    (mouse.y * scaleInfo.step) /
    (scale.height * (scale.height - scaleInfo.step));
  // zoomTop = Math.max(0, Math.min(canvas.height - zoomHeight, zoomTop));
};
