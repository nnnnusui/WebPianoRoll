import React, { useState } from "react";
import { range0to } from "../../range";
import ScaleController from "./controller/ScaleController";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";
import NotesController from "./controller/NotesController";
import PointerActionConsumer, {
  PointerAction,
  PointerActionType,
} from "./PointerActionConsumer";
import MoveController from "./controller/MoveController";

type Props = {
  context: CanvasRenderingContext2D;
  canvasSize: Size;
  gridSize: Size;
};
const GridController: React.FC<Props> = ({ context, canvasSize, gridSize }) => {
  const [debug, setDebug] = useState("");
  const maxPos = { x: canvasSize.width, y: canvasSize.height };
  const move = MoveController(maxPos);
  const scale = ScaleController(move, 10, { width: 2, height: 2 });
  const selection = SelectionController();
  const note = NotesController();

  const grid = Grid(gridSize);
  const cellSize = {
    width: (canvasSize.width / grid.size.width) * scale.get.width,
    height: (canvasSize.height / grid.size.height) * scale.get.height,
  };
  const getViewLocal = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const actionMap = new Map<PointerActionType, PointerAction>([
    [
      "move",
      {
        down: (event) => move.start(getViewLocal(event)),
        move: (event) => move.middle(getViewLocal(event), scale.get),
        up: () => move.end(),
      },
    ],
  ]);
  const pointers = PointerActionConsumer(actionMap);

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
    context.save();

    grid.draw(context, move.get, cellSize);
    note.draw(context, move.get, cellSize);
    selection.draw(context, move.get);
    context.restore();
  };
  window.requestAnimationFrame(draw);

  return (
    <>
      <div
        className="absolute h-full w-full"
        {...pointers}
        {...{ onWheel }}
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      ></div>
      <h1>
        {`debug: ${debug}`} _{" "}
        {pointers.state
          .map(([, { actionType }], index) => `${index}: ${actionType}`)
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
    range0to(size.width + 1)
      .map((index) => index * cellSize.width)
      .map((it) => it - move.x)
      .forEach((it) => {
        context.moveTo(it, 0);
        context.lineTo(it, max.height);
      });
    range0to(size.height + 1)
      .map((index) => index * cellSize.height)
      .map((it) => it - move.y)
      .forEach((it) => {
        context.moveTo(0, it);
        context.lineTo(max.width, it);
      });
    context.strokeStyle = "black";
    context.stroke();
    drawCoordinatesText(context, move, cellSize);
  };
  const drawCoordinatesText = (
    context: CanvasRenderingContext2D,
    move: Pos,
    cellSize: Size
  ) => {
    const padding = {
      x: (cellSize.width / 10) * -1,
      y: (cellSize.height / 10) * -1,
    };

    range0to(size.width + 1)
      .flatMap((column) =>
        range0to(size.height + 1).map((row) => [row, column])
      )
      .forEach(([row, column]) => {
        const start = {
          x: column * cellSize.width - move.x - padding.x,
          y: row * cellSize.height - move.y - padding.y,
        };
        context.fillText(
          `x: ${column}, y: ${row}`,
          start.x,
          start.y,
          cellSize.width
        );
      });
  };
  return { size, draw };
};
