import React, { useState } from "react";
import Selection, { SelectionMode } from "../contexts/SelectionContext";

type Props = {
  pos: { x: number; y: number };
};
const ActionCell: React.FC<Props> = ({ pos }) => {
  console.log("render")
  const selection = {
    setFrom: Selection.Contexts.from.Dispatch(),
    setTo: Selection.Contexts.to.Dispatch(),
    setMode: Selection.Contexts.mode.Dispatch(),
  };
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    selection.setFrom(pos);
    switch (event.button) {
      case 0:
        selection.setMode(SelectionMode.line);
        break;
      case 2:
        selection.setMode(SelectionMode.range);
        break;
    }
  };
  const onMouseMove = (event: React.MouseEvent) => {
    event.preventDefault();
    selection.setTo(pos);
  };
  const onMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    switch (event.button) {
      case 0:
        selection.setMode(SelectionMode.none)
        break;
    }
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
