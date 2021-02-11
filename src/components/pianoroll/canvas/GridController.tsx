import React, { useState } from "react";
import { range0to } from "../../range";
import ScaleController from "./controller/ScaleController";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";
import MoveController from "./controller/MoveController";
import NotesController from "./controller/NotesController";
import Pointers from "./Pointers";

type Props = {
  context: CanvasRenderingContext2D;
  canvasSize: Size;
  gridSize: Size;
};
const GridController: React.FC<Props> = ({ context, canvasSize, gridSize }) => {
  const [debug, setDebug] = useState("");

  /* 高度なActionメモ
   * ダブルタップ
   * -> 近い場合 状態を保持
   *   -> 片方を離す -> select
   *   -> 3つ目を置く
   *     -> 横にスライド -> 横scale
   *     -> 縦にスライド -> 縦scale
   * -> scale
   *
   * これをやるには、各Actionの実行状態(actionMap)を
   * ActionConfigParameter#conditions() に渡す必要がある？
   *
   * "select" 0, "doubleTap" 1, "hscale" 2, "vscale" 2, "scale" 1 でいける？
   */
  const pointers = Pointers();

  /* 0 -> 1: put
   * 1 -> 2: scale
   * 1 -> 2 && near: select
   * 2 -> 1: move
   * ...: put
   *
   * put(start: cellPos, middle: cellPos)
   * scale(focus: viewLocal, otherSide: viewLocal)
   * select(start: viewLocal, middle: viewLocal)
   * move(start: viewLocal, middle: (viewLocal, scale))
   */

  const onPointerDown = (event: React.PointerEvent) => {
    pointers.add(event);
  };
  const onPointerMove = (event: React.PointerEvent) => {};
  const onPointerUp = (event: React.PointerEvent) => {
    pointers.remove(event);
  };
  const onPointerCancel = onPointerUp;
  const onPointerOut = onPointerUp;
  const onWheel = (event: React.WheelEvent) => {};
  return (
    <>
      <div
        className="absolute h-full w-full"
        {...{
          onPointerDown,
          onPointerMove,
          onPointerUp,
          onPointerCancel,
          onPointerOut,
          onWheel,
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      ></div>
      <h1>
        {`debug: ${debug} _
      ${Array.from(pointers.state.entries())
        .map(([, { action }], index) => `${index}: ${action}`)
        .join(" ")}`}
      </h1>
    </>
  );
};
export default GridController;
