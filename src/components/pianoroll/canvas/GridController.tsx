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
  const types = ["put", "scale", "select", "move"] as const;
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
    const trySetAction = (next: State, currentId: PointerId, type: Type, backward: number) => {
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

    const actionConfigDefaultParameter = { backward: 0, unique: true, conditions: (event: React.PointerEvent) => true}
    type ActionType = { type: Type }
    type ActionConfigParameter = typeof actionConfigDefaultParameter
    type ActionConfig = ActionType & ActionConfigParameter
    type ActionConfigOverride = ActionType & Partial<ActionConfigParameter>
    const actionConfigOverrides: ActionConfigOverride[] = [{
      type: "put",
      unique: false
    }, {
      type: "scale",
      backward: 1
    }, {
      type: "select",
      backward: 1,
      conditions: (event) => event.type == ""
    }, {
      type: "move",
      backward: 2,
    }]
    const actionConfigs: ActionConfig[] = actionConfigOverrides.map(it=> ({...actionConfigDefaultParameter, ...it}))

    const trySetActionOn = (event: React.PointerEvent,next: State, currentId: PointerId, config: ActionConfig) => {
      const {type, backward, unique, conditions} = config
      if (unique && actionMap.get(type)?.length != 0) return false;
      if (!conditions(event)) return false;
      return trySetAction(next, currentId, type, backward);
    }

    const add = (event: React.PointerEvent) => {
      const currentId = event.pointerId;
      setPointers((prev) => {
        const next = new Map(prev)
        actionConfigs
          .sort(it=> -it.backward)
          .reduce((hasResult, it)=> hasResult ? true : trySetActionOn(event, next, currentId, it), false)
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
