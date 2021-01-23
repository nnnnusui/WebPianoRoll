import React from "react";

type Props = {
  pos: { x: number; y: number };
  length: number
};
const Note: React.FC<Props> = ({ pos, length }) => {
  
  const style = {
    gridColumnStart: pos.x + 1,
    gridRowStart: pos.y + 1,
    gridColumnEnd: pos.x + length + 1,
  };
  return <div className="pointer-events-auto bg-yellow-500 rounded-lg" style={style}></div>;
};

export default Note;
