import React from "react";
import Selection, { SelectionMode } from "../../contexts/SelectionContext";

const SelectBox: React.FC = () => {
  const [from, to, mode] = [
    Selection.Contexts.from.State(),
    Selection.Contexts.to.State(),
    Selection.Contexts.mode.State(),
  ];
  const style = (() => {
    const startFix = 1;
    const endFix = 2;
    switch (mode) {
      case SelectionMode.line:
        return {
          gridColumnStart: startFix + Math.min(from.x, to.x),
          gridColumnEnd: endFix + Math.max(from.x, to.x),
          gridRowStart: startFix + from.y,
          gridRowEnd: endFix + from.y,
        };
      case SelectionMode.range:
        return {
          gridColumnStart: startFix + Math.min(from.x, to.x),
          gridColumnEnd: endFix + Math.max(from.x, to.x),
          gridRowStart: startFix + Math.min(from.y, to.y),
          gridRowEnd: endFix + Math.max(from.y, to.y),
        };
      case SelectionMode.none:
        return {
          display: "none",
        };
    }
  })();
  return <div className="bg-white opacity-25" style={style}></div>;
};

export default SelectBox;
