import React, { useEffect } from "react";
import Context from "./context/Context";
import { RollProps } from "./entity/Roll";

const ActionConsumer: React.FC<RollProps> = (roll) => {
  const rollId = roll.id;
  const notes = Context.notes.State().get(rollId)!;
  const action = Context.action.State();
  const setAction = Context.action.Dispatch();
  const setUnApply = () => setAction((prev) => ({ ...prev, apply: false }));
  const noteAction = Context.notes.Dispatch();

  const posFromGridIndex = (gridIndex: number) => ({
    x: Math.floor(gridIndex / roll.height),
    y: gridIndex % roll.height,
  });
  const getNoteRestDataFromPos = (pos: { x: number; y: number }) => {
    const offset = pos.x;
    const octave = roll.maxOctave - Math.floor(pos.y / roll.maxPitch);
    const pitch = roll.maxPitch - (pos.y % roll.maxPitch) - 1;
    return { offset, octave, pitch };
  };
  useEffect(() => {
    const { from, to, apply } = action;
    if (from == null) return;
    if (!apply) return;
    setUnApply();

    const create = () => {
      const fromPos = posFromGridIndex(from.gridIndex);
      const toPos = posFromGridIndex(to.gridIndex);
      const startPos = {
        x: Math.min(fromPos.x, toPos.x),
        y: fromPos.y,
      };
      const request = {
        ...getNoteRestDataFromPos(startPos),
        length: Math.abs(fromPos.x - toPos.x) + 1,
        childRollId: null,
      };
      noteAction({ type: "create", rollId, request });
    };
    const update = () => {
      if (from.type != "Note") return;
      const fromNote = notes.get(from.noteId)!.data;
      const fromPos = posFromGridIndex(from.gridIndex);
      const toPos = posFromGridIndex(to.gridIndex);
      switch (from.part) {
        case "left": {
          const noteEnd = posFromGridIndex(
            from.gridIndex + (fromNote.length - 1) * roll.height
          );
          const exceedEnd = noteEnd.x < toPos.x;
          const startPos = { x: Math.min(toPos.x, noteEnd.x), y: fromPos.y };
          const request = {
            ...fromNote,
            ...getNoteRestDataFromPos(startPos),
            length: exceedEnd ? 1 : noteEnd.x - toPos.x + 1,
          };
          noteAction({ type: "update", rollId, request });
          break;
        }
        case "right": {
          const noteStart = fromPos;
          const exceedStart = from.gridIndex < to.gridIndex;
          const startPos = noteStart;
          const request = {
            ...fromNote,
            ...getNoteRestDataFromPos(startPos),
            length: exceedStart ? toPos.x - fromPos.x + 1 : 1,
          };
          noteAction({ type: "update", rollId, request });
          break;
        }
        case "center":
          const request = {
            ...fromNote,
            ...getNoteRestDataFromPos(toPos),
            length: fromNote.length,
          };
          noteAction({ type: "update", rollId, request });
          break;
      }
    };
    const remove = () => {
      if (to.type != "Note") return;
      noteAction({
        type: "delete",
        rollId: roll.id,
        request: { id: to.noteId },
      });
    };

    if (from.type == "ActionCell") if (to.type == "ActionCell") create();
    if (from.type == "Note")
      if (to.type == "Note")
        if (from.part == "center" && from.gridIndex == to.gridIndex) remove();
    if (from.type == "Note") if (to.type == "ActionCell") update();
    // if (from.type == "RollList")
    //   if (to.type == "ActionCell")
    //     create(to.gridIndex, to.gridIndex, from.rollId);
    // if (from.type == "RollList")
    //   if (to.type == "RollList")
    //     if (from.rollId == to.rollId) putNote.setSelectedRollId(to.rollId);
  }, [action]);

  return <></>;
};
export default ActionConsumer;
