import React, { useRef, useState, useLayoutEffect } from "react";
import { Size } from "./pianoroll/type/Size";

function useRefSizeState<T extends HTMLElement>(use: (element: T) => void) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const updateSize = () => {
    const element = ref.current;
    if (!element) return;
    setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    });
  };

  // Reflects the current size of the element in the size state
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Monitor `use()` and use changes
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    use(element);
  }, [use, size]);

  return { ref, size };
}

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
