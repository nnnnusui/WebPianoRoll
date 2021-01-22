import React from "react";
import { useSelectionContext } from "./SelectionContext";

type Props = {
  pos: { x: number; y: number };
};
const ActionCell: React.FC<Props> = ({ pos }) => {
  const [{ from }, setSelection] = useSelectionContext();
  return (
    <div
      className={`relative h-full w-full ${"bg-gray-600 rounded-sm"}`}
      onMouseDown={() => setSelection({ from: pos, to: pos })}
      onDragEnter={() => setSelection({ from: from, to: pos })}
      draggable="true"
    ></div>
  );
};

export default ActionCell;
