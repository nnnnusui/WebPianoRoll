import React from "react";

type Props = {
  gridIndex: number;
};
const selfType = "ActionCell";
const ActionCell: React.FC<Props> = ({ gridIndex }) => {
  return (
    <div
      {...{ type: selfType, gridindex: gridIndex }}
      className="action-cell relative h-full w-full bg-gray-600 rounded-sm"
    ></div>
  );
};

export default ActionCell;
