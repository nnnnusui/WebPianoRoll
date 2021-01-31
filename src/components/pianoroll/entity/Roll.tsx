import React from "react";

type Props = {
  id: number;
  width: number;
  height: number;
};
const Roll: React.FC<Props> = ({ id, width, height }) => {
  const style = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };
  return (
    <div className="pointer-events-none absolute h-full w-full" style={style}>
      <h1 className="">__roll {id}</h1>
    </div>
  );
};
export default Roll;
export type { Props as RollProps };
