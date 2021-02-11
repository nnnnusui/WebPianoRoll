import React, { useState } from "react";
import { range0to } from "../../range";
import ScaleController from "./controller/ScaleController";
import SelectionController from "./controller/SelectionController";
import { Pos } from "./type/Pos";
import { Size } from "./type/Size";
import MoveController from "./controller/MoveController";
import NotesController from "./controller/NotesController";

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
   * "doubleTap" 1, "select" 2, "hscale" 2, "vscale" 2, "scale" 1 でいける？
   */
  type PointerId = number;
  const types = ["put", "select", "scale", "move"] as const;
  type ActionType = typeof types[number];
  type PointerInfo = {
    event: React.PointerEvent;
    action: ActionType;
  };
  type State = Map<PointerId, PointerInfo>;

  type ActionConfigParameter = {
    backward: number;
    unique: boolean;
    residue: ActionType;
    conditions: (event: React.PointerEvent) => boolean;
  };
  const defaultParameter: ActionConfigParameter = {
    backward: 0,
    unique: true,
    residue: "put",
    conditions: (event: React.PointerEvent) => true,
  };
  type ActionConfig = Map<ActionType, ActionConfigParameter>;
  type ActionConfigOverride = Map<ActionType, Partial<ActionConfigParameter>>;
  const actionConfigOverride: ActionConfigOverride = new Map([
    ["put", { unique: false }],
    ["select", { backward: 1, residue: "select", unique: false }],
    ["scale", { backward: 1, residue: "move" }],
    // ["move", { backward: 2 }],
  ]);
  const actionConfig: ActionConfig = new Map(
    types.map((it) => [
      it,
      { ...defaultParameter, ...actionConfigOverride.get(it)! },
    ])
  );
  const [pointerMap, setPointers] = useState<State>(new Map());
  const Pointers = (() => {
    const pointers = Array.from(pointerMap);
    const actionMapInit: Map<ActionType, React.PointerEvent[]> = new Map(
      types.map((it) => [it, []])
    );
    const actionMap = new Map(
      pointers.reduce(
        (map, [key, { action, event }]) =>
          map.set(action, [...map.get(action)!, event]),
        actionMapInit
      )
    );

    const getPriorityLowers = (type: ActionType) => {
      const targetPriority = types.indexOf(type);
      return pointers.filter(
        ([, { action: it }]) => types.indexOf(it) < targetPriority
      );
    };
    const getBackwards = (type: ActionType, backward: number) => {
      const priorityLowerPointers = getPriorityLowers(type);
      return priorityLowerPointers.length < backward
        ? []
        : priorityLowerPointers.slice(-backward);
    };

    const trySetActionOn = (
      event: React.PointerEvent,
      next: State,
      currentId: PointerId,
      type: ActionType,
      config: ActionConfigParameter
    ) => {
      const { backward, unique, conditions } = config;
      if (unique && actionMap.get(type)?.length != 0) return false;
      if (!conditions(event)) return false;
      const pointers = [
        ...getBackwards(type, backward).map(([pointerId]) => pointerId),
        currentId,
      ];
      if (pointers.length <= backward) return false;
      pointers.map((it) => next.set(it, { ...next.get(it)!, action: type }));
      return true;
    };

    const add = (event: React.PointerEvent) => {
      const currentId = event.pointerId;
      setPointers((prev) => {
        const next = new Map(prev);
        Array.from(actionConfig)
          .sort(([, { backward }]) => -backward)
          .reduce((hasResult, [type, parameter]) => {
            if (hasResult) return true;
            return trySetActionOn(event, next, currentId, type, parameter);
          }, false);
        return next;
      });
    };
    const update = (event: React.PointerEvent) => {
      const id = event.pointerId;
    };
    const remove = (event: React.PointerEvent) => {
      const id = event.pointerId;
      setPointers((prev) => {
        const before = prev.get(id)!.action;
        const config = actionConfig.get(before)!;
        const next = new Map(prev);
        actionMap
          .get(before)
          ?.filter((it) => it.pointerId != id)
          .slice(config.backward * -1)
          .forEach((it) =>
            next.set(it.pointerId, { action: config.residue, event: it })
          );
        next.delete(id);
        return next;
      });
    };
    return {
      add,
      remove,
    };
  })();

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
    Pointers.add(event);
  };
  const onPointerMove = (event: React.PointerEvent) => {};
  const onPointerUp = (event: React.PointerEvent) => {
    Pointers.remove(event);
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
      <h1>{`debug: ${debug} _ ${Array.from(pointerMap.entries())
        .map(([, mode], index) => `${index}: ${mode}`)
        .join(" ")}`}</h1>
    </>
  );
};
export default GridController;
