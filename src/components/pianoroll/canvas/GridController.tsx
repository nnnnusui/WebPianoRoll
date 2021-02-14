import React, { useState } from "react";
import { range0to } from "../../range";
import ScaleState from "./state/ScaleState";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";
import PointerActionConsumer from "./PointerActionConsumer";
import MoveState from "./state/MoveState";
import MoveAction from "./pointerAction/MoveAction";
import ScaleAction from "./pointerAction/ScaleAction";
import NoteAction from "./pointerAction/NoteAction";
import NoteState from "./state/NoteState";
import NoteDrawer from "./drawer/NoteDrawer";
import PointerActionConfig from "./PointerActionConfig";
import PointerActionDistributor from "../../pointerAction/Distributor";
import PointerActionState from "../../pointerAction/State";
import PointerActionSettings from "../../pointerAction/Settings";

type Props = {
  context: CanvasRenderingContext2D;
  canvasSize: Size;
  gridSize: Size;
};
const GridController: React.FC<Props> = ({ context, canvasSize, gridSize }) => {
  const [debug, setDebug] = useState("");
  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const move = MoveState(maxPos);
  const scale = ScaleState(move, { width: 2, height: 2 });
  const selection = SelectionController();

  const grid = Grid(gridSize);
  const cellSize = {
    width: (canvasSize.width / grid.size.width) * scale.get.width,
    height: (canvasSize.height / grid.size.height) * scale.get.height,
  };

  const note = (() => {
    const state = NoteState();
    const action = NoteAction(state, move, cellSize);
    const draw = NoteDrawer(state, action);
    return { state, action, draw };
  })();

  const getViewLocal = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // const pointers = PointerActionConsumer(
  //   PointerActionConfig([
  //     { type: "move", parameter: {} },
  //     { type: "note", parameter: { unique: false } },
  //     {
  //       type: "scale",
  //       parameter: {
  //         premise: 1,
  //         overwrites: ["move", "note"],
  //         residue: "move",
  //       },
  //     },
  //   ]),
  //   [MoveAction(move, scale), ScaleAction(scale), note.action.override]
  // );
  const pointer = (() => {
    const state = PointerActionState();
    const settings = PointerActionSettings([]);
    const distributor = PointerActionDistributor(state, settings);
    return {
      ...distributor,
      ...state,
    };
  })();

  const onWheel = (event: React.WheelEvent) => {
    const scaleIn = event.deltaY > 0;
    const viewLocal = getViewLocal(event);
    const scalar = 0.5;
    const step = scaleIn ? scalar : -scalar;
    scale.add(viewLocal, { width: step, height: step });
  };

  const draw = () => {
    context.beginPath();
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.fill();
    context.save();

    context.strokeStyle = "#666666";
    grid.draw(context, move.get, cellSize);
    note.draw(context, move.get, cellSize);
    selection.draw(context, move.get);
    pointer.state.forEach(({ event }) => {
      const viewLocal = getViewLocal(event);
      context.fillStyle = "#f5dd67";
      context.beginPath();
      context.arc(viewLocal.x, viewLocal.y, 30, 0, 2 * Math.PI);
      context.closePath();
      context.fill();
    });
    context.restore();
  };
  window.requestAnimationFrame(draw);

  return (
    <>
      <div
        className="absolute h-full w-full"
        {...pointer.listeners}
        {...{ onWheel }}
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
        onDragStart={(e) => {
          e.preventDefault();
          return false;
        }}
      ></div>
      <h1 className="absolute text-white">
        {`debug: ${debug}`} _{" "}
        {Array.from(pointer.state)
          .map(([, { action }], index) => `${index}: ${action.type}`)
          .join(", ")}
      </h1>
    </>
  );
};
export default GridController;

const Grid = (size: Size) => {
  const draw = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    const max = {
      width: cellSize.width * size.width,
      height: cellSize.height * size.height,
    };
    const beatDenominator = 4;
    const beatNumerator = 4;
    const lineInterval = beatDenominator;
    const barInterval = beatDenominator * beatNumerator;
    range0to(size.width + 1).forEach((index) => {
      if (index % lineInterval != 0) return;
      const gridLocal = index * cellSize.width;
      const viewLocal = gridLocal - move.x;
      context.moveTo(viewLocal, 0);
      context.lineTo(viewLocal, max.height);
      if (index % barInterval != 0) return;
      if (index % (barInterval * 2) < 16) context.fillStyle = "#222222";
      else context.fillStyle = "#303030";
      context.fillRect(viewLocal, 0, cellSize.width * 16, max.height);
    });
    context.fillStyle = "#331111";
    range0to(size.height + 1).forEach((index) => {
      const gridLocal = index * cellSize.height;
      const viewLocal = gridLocal - move.y;
      const it = viewLocal;
      context.moveTo(0, it);
      context.lineTo(max.width, it);
      if (index % 12 != 11) return;
      context.fillRect(0, viewLocal, max.width, cellSize.height);
    });
    context.stroke();
  };
  return { size, draw };
};
