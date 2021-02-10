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
  const actions = [{
    type: "scale",
    backward: 1,
    after: "move",
  }, {
    type: "select",
    backward: 1,
    after: "select",
  }]
  const types = ["put", "move", "scale", "select"] as const;
  type Type = typeof types[number];
  type State = Map<PointerId, Type>
  const actionMapInit: Map<Type, PointerId[]> = new Map(types.map(it=> [it, []]));
  const [pointerMap, setPointers] = useState<State>(new Map());
  const Pointers = (() => {
    const pointers = Array.from(pointerMap)
    const actionMap = new Map(pointers.reduce((map, [key, value])=> map.set(value, [...map.get(value)!, key]), actionMapInit))

    const getPriorityLowers = (type: Type) => {
      const targetPriority = types.indexOf(type)
      return pointers.filter(([,type])=> types.indexOf(type) < targetPriority)
    }
    const getBackwards = (type: Type, backward: number) => {
      const priorityLowerPointers = getPriorityLowers(type)
      return priorityLowerPointers.length < backward ? [] : priorityLowerPointers.slice(-backward);
    }
    const trySetAction = (args: {next: State, currentId: PointerId, type: Type, backward: number, unique: boolean}) => {
      const {next, currentId, type, backward, unique} = args
      if (unique && actionMap.get(type)?.length != 0) return false;
      const backwards = getBackwards(type, backward)
      backwards.forEach(([pointerId,]) => {
        setDebug(`${pointerId}`)
        next.set(pointerId, type)
      });
      const executed = backwards.length >= backward
      if (executed)
        next.set(currentId, type)
      return executed
    }
    // const trySetSingleAction = (next: State, currentId: PointerId, target: Type) =>
    //   trySetAction(next, currentId, target, 0)
    // const trySetUniqueAction = (next: State, currentId: PointerId, target: Type, backward: number) => {
    //   // if (actionMap.get(target)?.length == 0)
    //     trySetAction(next, currentId, target, backward)
    // }

    const add = (event: React.PointerEvent) => {
      const currentId = event.pointerId;
      type X = {type: Type, backward: number, unique: boolean }
      const xDefault = {backward: 0, unique: true}
      const x: X[] = [{
        ...xDefault,
        type: "put",
        unique: false
      }, {
        ...xDefault,
        type: "scale",
        backward: 1
      }, {
        ...xDefault,
        type: "select",
        backward: 1
      }]
      setPointers((prev) => {
        const next = new Map(prev)
        x.sort(it=> -it.backward)
          .reduce((hasResult, it)=> hasResult ? true : trySetAction({next, currentId, ...it}), false)
        // trySetSingleAction(next, id, "put")
        // trySetUniqueAction(next, id, "scale", 1)
        // trySetUniqueAction(next, id, "select", 1)
        return next;
      });
    };
    const update = (event: React.PointerEvent) => {
      const id = event.pointerId;
    };
    const remove = (event: React.PointerEvent) => {
      const id = event.pointerId;
      setPointers((prev) => {
        const before = prev.get(id)!;
        const next = new Map(prev);
        // actionMap.get(before)
        //   ?.filter(it=> it != id)
        //    .forEach(it=> next.set(it, "move"))
        next.delete(id)
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
