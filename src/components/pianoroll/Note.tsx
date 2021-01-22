import React from "react";

type Props = {
  pos: { x: number; y: number };
};
const Note: React.FC<Props> = ({ pos }) => {
  const style = {
    gridColumnStart: pos.x + 1,
    gridRowStart: pos.y + 1,
  };
  return <div className="bg-yellow-500" style={style}></div>;
};

export default Note;
