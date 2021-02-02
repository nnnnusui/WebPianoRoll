import React, { useState, useRef } from "react";
import ResizeListener from "./ResizeListener";

type Props = {
    needCanvasElement: (data: {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    }) => React.FC
}
const Canvas: React.FC<Props> = ({needCanvasElement}) => {
    const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    const element = ()=> {
        if(canvas == null) return <></>;
        if(context == null) return <></>;
        return needCanvasElement({canvas, context})
    };

  return (
    <>
      <ResizeListener setSize={setCanvasSize} />
      <canvas className="pointer-events-none absolute h-full w-full"
        ref={canvasRef}
        {...canvasSize}
      ></canvas>
      {element()}
    </>
  );
};
export default Canvas;
