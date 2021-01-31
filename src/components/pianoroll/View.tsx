import React from "react";
import Context from "./context/Context";
import Roll, { RollProps } from "./entity/Roll";
import ActionLayer from "./grid/layer/ActionLayer";

const View: React.FC = () => {
  const roll = Context.roll.selected();
  if (roll == undefined) return <></>;

  return (
    <div className="relative h-full w-full">
      <ActionLayer {...roll.data} />
      <Roll {...roll.data} />
    </div>
  );
};
export default View;

const action = (roll: RollProps) => {
  const gridIndexToPos = (gridIndex: number) => ({
    x: Math.floor(gridIndex / roll.height),
    y: gridIndex % roll.height,
  });
  const getNoteRestValuesFromPos = (pos: { x: number; y: number }) => {
    const offset = pos.x;
    const octave = roll.maxOctave - Math.floor(pos.y / roll.maxPitch);
    const pitch = roll.maxPitch - (pos.y % roll.maxPitch) - 1;
    return { offset, octave, pitch };
  };

  // return (from, to) => {
  //   if (from.type == "ActionCell")
  //     if (to.type == "ActionCell") create(from.gridIndex, to.gridIndex);
  //   if (from.type == "Note")
  //     if (to.type == "Note")
  //       if (from.gridIndex == to.gridIndex) remove(to.gridIndex);
  //   if (from.type == "Note")
  //     if (to.type == "ActionCell") update(from.gridIndex, to.gridIndex);
  //   if (from.type == "RollList")
  //     if (to.type == "ActionCell")
  //       create(to.gridIndex, to.gridIndex, from.rollId);
  //   if (from.type == "RollList")
  //     if (to.type == "RollList")
  //       if (from.rollId == to.rollId) putNote.setSelectedRollId(to.rollId);
  // }
};
