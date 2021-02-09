import React from "react";
import Context from "../context/Context";
import Notes from "./Notes";

type Props = {
  id: number;
};
const Roll: React.FC<Props> = ({ id }) => {
  const roll = Context.rolls.State().get(id)?.data;
  if (roll == null) return <></>;

  const style = {
    gridTemplateColumns: `repeat(${roll.width}, 1fr)`,
    gridTemplateRows: `repeat(${roll.height}, 1fr)`,
  };

  return (
    <div
      className="pointer-events-none absolute h-full w-full grid grid-flow-col"
      style={style}
    >
      <Notes rollId={id} />
    </div>
  );
};
export default Roll;
export type { Props as RollProps };
