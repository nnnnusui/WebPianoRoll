import React, { useRef, useEffect } from "react";
import { Size } from "./type/Size";

type Props = {
  setSize: React.Dispatch<React.SetStateAction<Size | undefined>>;
};
const ResizeListener: React.FC<Props> = ({ children, setSize }) => {
  const ref = useRef<HTMLDivElement>(null);

  const applySize = () => {
    const element = ref.current;
    if (element == null) return;
    setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    });
  };

  useEffect(() => applySize(), []);
  window.addEventListener("resize", () => applySize());

  return (
    <div ref={ref} className="pointer-events-none absolute h-full w-full">
      {children}
    </div>
  );
};
export default ResizeListener;
