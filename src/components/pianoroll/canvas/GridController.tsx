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

  type PointerId = number;
  const types = ["put", "move", "scale", "select"] as const;
  type Type = typeof types[number];
  type State = Map<PointerId, Type>
  const actionMapInit: Map<Type, PointerId[]> = new Map(types.map(it=> [it, []]));
  const [pointerMap, setPointers] = useState<State>(new Map());
  const Pointers = (() => {
    // const pointerMap = new Map(Array.from(_pointers).flatMap(([key, value]) => value.map(it => [it, key])));
    const pointers = Array.from(pointerMap)
    const actionMap = new Map(pointers.reduce((map, [key, value])=> map.set(value, [...map.get(value)!, key]), actionMapInit))
    const actions = Array.from(actionMap)

    const getPriorityLowers = (target: Type) => {
      const targetPriority = types.indexOf(target)
      return pointers.filter(([,type])=> types.indexOf(type) < targetPriority)
    }
    const getBackwards = (target: Type, backward: number) => {
      const priorityLowerPointers = getPriorityLowers(target)
      return priorityLowerPointers.length < backward ? [] : priorityLowerPointers.slice(-backward);
    }
    const trySetAction = (next: State, currentId: PointerId, target: Type, backward: number) => {
      const backwards = getBackwards(target, backward)
      backwards.forEach(([pointerId,]) => {
        next.set(pointerId, "scale")
      });
      if (backwards.length > 0)
        next.set(currentId, "scale")
    }

    const add = (event: React.PointerEvent) => {
      const id = event.pointerId;
      setPointers((prev) => {
        const next = new Map(prev)
        trySetAction(next, id, "scale", 1)
        return next;
      });
    };
    const update = (event: React.PointerEvent) => {
      const id = event.pointerId;
    };
    const remove = (event: React.PointerEvent) => {
      const id = event.pointerId;
      setPointers((prev) => {
        const before = prev.get(id);
        prev.delete(id);
        if (before == "scale") {
          const key = Array.from(prev.entries()).find(
            ([key, value]) => value == "scale"
          )?.[0];
          key ? prev.set(key, "move") : null;
        }
        return new Map(prev);
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
      <h1>{`debug: ${Array.from(_pointers.entries())
        .map(([, mode], index) => `${index}: ${mode}`)
        .join(" ")}`}</h1>
    </>
  );
};
export default GridController;
