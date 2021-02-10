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
  const [pointers, setPointers] = useState<Map<number, string>>(new Map())


  const onPointerDown = (event: React.PointerEvent) => {
    const id = event.pointerId
    setPointers(prev => {
      const mode = (() => {
        switch (prev.size) {
          case 0: return "put"
          case 1:
            const otherSide = prev.keys().next().value
            prev.set(otherSide, "scale")
            return "scale"
          default: return "put"
        }
      })()
      return new Map(prev.set(id, mode))
    })
  };
  const onPointerMove = (event: React.PointerEvent) => {
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const id = event.pointerId
    setPointers(prev => {
      const before = prev.get(id)
      prev.delete(id)
      if (before == "scale"){
        const key = Array.from(prev.entries()).find(([key, value]) => value == "scale")?.[0]
        key ? prev.set(key, "move") : null ;
      }
      return new Map(prev)
    })
  };
  const onPointerCancel = onPointerUp;
  const onPointerOut = onPointerUp;
  const onWheel = (event: React.WheelEvent) => {
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
      <h1>{`debug: ${Array.from(pointers.entries()).map(([,mode], index) => `${index}: ${mode}`).join(" ")}`}</h1>
    </>
  );
};
export default GridController;
