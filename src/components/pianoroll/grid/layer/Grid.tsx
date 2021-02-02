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
}
const Grid: React.FC<Props> = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scaleCount, setScaleCount] = useState(1)
  const scale = scaleInfo.min + (scaleCount * scaleInfo.step)
  const [onMove, setOnMove] = useState(false)
  const [moveFrom, setMoveFrom] = useState({x: 0, y: 0})
  const [move, setMove] = useState({x: 0, y: 0})

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  const roll = Context.roll.selected()?.data;

  const forward = ()=> {
    if (canvas == null) return;
    if (context == null) return;
    if (roll == null) return;
    const cellSize = {
      width: (canvas?.width || 100) / roll.width,
      height: (canvas?.height || 200) / roll.height,
    };
  
    const draw = () => {
      context.beginPath();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      context.scale(scale, 1);
      drawGrid(context, {x: -move.x, y: -move.y}, cellSize, { ...roll });
      context.restore();
    };
    window.requestAnimationFrame(draw);
  
    const getElementLocalMousePosFromEvent = (event: React.PointerEvent) => {
      const element = event.target as HTMLElement
      const rect = element.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
    const moveStart = (start: Pos) => {
      const mouse = {
        x: start.x + move.x,
        y: start.y + move.y,
      }
      setMoveFrom(mouse)
      setOnMove(true)
    }
    const moveIn = (pos: Pos) => {
      if(!onMove) return;
      const vector = {
        x: moveFrom.x - pos.x,
        y: moveFrom.y - pos.y,
      }
      setMove(vector)
    }
    const moveEnd = () => {
      setMoveFrom({x: 0, y: 0})
      setOnMove(false)
    }
    const onPointerDown = (event: React.PointerEvent) => {
      const mouse = getElementLocalMousePosFromEvent(event)
      moveStart(mouse)
    };
    const onPointerMove = (event: React.PointerEvent) => {
      const mouse = getElementLocalMousePosFromEvent(event)
      moveIn(mouse)
    }
    const onPointerUp = (event: React.PointerEvent) => {
      moveEnd()
    };
    const onWheel = (event: React.WheelEvent) =>{
      // const scaleIn = event.deltaY > 0
      // setScaleCount(prev => {
      //   const next = prev + (scaleIn ? 1 : -1)
      //   if (next <= 0) return 0;
      //   if (next > scaleInfo.max) return scaleInfo.max;
      //   const element = event.target as HTMLElement
      //   const rect = element.getBoundingClientRect();
      //   const mouse = {
      //     x: event.clientX - rect.left,
      //     y: event.clientY - rect.top,
      //   }
      //   console.log(canvas.width)
      //   console.log(mouse.x / scale)
      //   return next
      // })
    }
    return <div className="absolute h-full w-full" {...{ onPointerDown, onPointerMove, onPointerUp, onWheel }}></div>
  }

  return (
    <>
      <ResizeListener setSize={setCanvasSize} />
      <canvas className="pointer-events-none absolute h-full w-full"
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
    .map(it => it + start.x)
    .forEach((it) => {
      context.moveTo(it, 0);
      context.lineTo(it, max.height);
    });
  range0to(quantities.height + 1)
    .map((index) => index * cellSize.height)
    .map(it => it + start.y)
    .forEach((it) => {
      context.moveTo(        0, it);
      context.lineTo(max.width, it);
    });
  context.strokeStyle = "black";
  context.stroke();
};

const focusScale = (context: CanvasRenderingContext2D, canvas: Size, scale: Size, mouse: Pos) => {
  // 切り抜き領域の幅(sw), 高さ(sh) の計算
  const zoomWidth = canvas.width / scale.width;
  const zoomHeight = canvas.height / scale.height;
 
  // 切り抜き領域の開始点X座標 (sx) の計算
  const zoomLeft = mouse.x * scaleInfo.step / (scale.width * (scale.width - scaleInfo.step));
  // const zoomLeft = Math.max(0, Math.min(canvas.width - zoomWidth, zoomLeft));
 
  // 切り抜き領域の開始点Y座標 (sy) の計算
  const zoomTop = mouse.y * scaleInfo.step / (scale.height * (scale.height - scaleInfo.step));
  // zoomTop = Math.max(0, Math.min(canvas.height - zoomHeight, zoomTop));
}
