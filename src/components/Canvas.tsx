import React, {
  useRef,
  useState,
  DependencyList,
  useLayoutEffect,
} from "react";
import { Size } from "./pianoroll/type/Size";

function useRefSizeState<T extends HTMLElement>(
  use: (element: T) => void,
  deps: DependencyList = []
) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const updateSize = () =>
    setSize({
      width: ref.current!.clientWidth,
      height: ref.current!.clientHeight,
    });

  // Reflects the current size of the element in the size state
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Monitor `deps` and use changes
  useLayoutEffect(() => {
    use(ref.current!);
  }, [size, ...deps]);

  return { ref, size };
}

type Props = {
  useCanvas: (canvas: HTMLCanvasElement) => void;
  deps?: DependencyList;
  attrs?: object;
};
const Canvas: React.FC<Props> = ({ useCanvas, deps = [], attrs = {} }) => {
  const { ref, size } = useRefSizeState(useCanvas, deps);

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
