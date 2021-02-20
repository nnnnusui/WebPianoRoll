import React from "react";
import useRefSizeState from "./useRefSizeState";

type Props = {
  useCanvas: (canvas: HTMLCanvasElement) => void;
  attrs?: Record<string, unknown>;
};
const Canvas: React.FC<Props> = ({ useCanvas, attrs = {} }) => {
  const { ref, size } = useRefSizeState(useCanvas);

  return (
    <canvas
      className="absolute h-full w-full"
      ref={ref}
      {...size}
      {...attrs}
    ></canvas>
  );
};
export default Canvas;
