import React from "react";
import Context from "../context/Context";

type Props = {
  rollId: number;
};
const selfType = "RollListCell";
const RollListCell: React.FC<Props> = ({ rollId }) => {
  const selectedRollId = Context.roll.selectedId.State();
  const setSelectedRollId = Context.roll.selectedId.Dispatch();
  const onClick = () => {
    setSelectedRollId(rollId);
  };
  const color = rollId == selectedRollId ? "bg-gray-300" : "";
  const info = { type: selfType, rollid: rollId };
  return (
    <div {...info} key={rollId} className={`${color}`} onClick={onClick}>
      roll _ {rollId}
    </div>
  );
};
export default RollListCell;
