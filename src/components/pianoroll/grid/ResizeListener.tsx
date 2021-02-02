import React, { useRef, useEffect } from "react";

type Props = {
  setSize: React.Dispatch<React.SetStateAction<{
    width: number;
    height: number;
  }>>
}
const ResizeListener: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const applySize = ()=> {
    const element = ref.current
    if (element == null) return;
    props.setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    })
  }

  useEffect(()=> applySize(), [])
  window.addEventListener("resize", ()=> applySize());

  return <div ref={ref} className="pointer-events-none absolute h-full w-full"></div>;
};
export default ResizeListener;
