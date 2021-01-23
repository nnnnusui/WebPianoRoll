import React from "react";
import Selection, { SelectionMode } from "./SelectionContext";

type Props = {
  pos: { x: number; y: number };
};
const ActionCell: React.FC<Props> = ({ pos }) => {
  const [{ from, mode }, setSelection] = [
    Selection.state(),
    Selection.dispatch(),
  ];
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    switch (event.button) {
      case 0:
        setSelection({ from: pos, to: pos, mode: SelectionMode.line });
        break;
      case 2:
        setSelection({ from: pos, to: pos, mode: SelectionMode.range });
        break;
    }
  };
  const onMouseMove = (event: React.MouseEvent) => {
    event.preventDefault();
    if (mode != SelectionMode.none) setSelection({ from: from, to: pos, mode });
  };
  const onMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    setSelection({ from: from, to: pos, mode: SelectionMode.none });
  };
  return (
    <div
      className={`relative h-full w-full ${"bg-gray-600 rounded-sm"}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      draggable="true"
    ></div>
  );
};

export default ActionCell;
