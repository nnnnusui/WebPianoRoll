import { useEffect, useRef, useState } from "react";
import { Size } from "./pianoroll/canvas/type/Size";

const useCanvasRef = (callback: (canvas: HTMLCanvasElement) => void) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    callback(canvas);
  }, []);
  return ref;
};

type Props = {
  useCanvas: (canvas: HTMLCanvasElement) => void;
};
const Canvas: React.FC<Props> = ({ useCanvas }) => {
  const [size, setSize] = useState<Size>();
  const resize = (canvas: HTMLCanvasElement) => {
    setSize({
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    });
    window.requestAnimationFrame(() => useCanvas(canvas));
  };
  const ref = useCanvasRef((canvas) => {
    resize(canvas);
    window.addEventListener("resize", () => resize(canvas));
  });

  return (
    <canvas
      className="pointer-events-none absolute h-full w-full"
      ref={ref}
      {...size}
    ></canvas>
  );
};
export default Canvas;
