import React, { useEffect } from "react";
import Context from "./context/Context";
import { RollProps } from "./entity/Roll";

const ActionConsumer: React.FC<RollProps> = (roll) => {
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
      noteAction({ type: "create", rollId: roll.id, request });
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
      if (to.type == "Note") if (from.gridIndex == to.gridIndex) remove();
    // if (from.type == "Note")
    //   if (to.type == "ActionCell") update(from.gridIndex, to.gridIndex);
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
