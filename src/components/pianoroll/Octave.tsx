import React from "react";
import Cell from "./Cell";

type Props = {
  offset: number;
  octave: number;
};
const Octave: React.FC<Props> = ({ ...props }) => {
  const cells = [...Array(12)]
    .map((_, index) => index)
    .reverse()
    .map((index) => <Cell key={index} pitch={index} {...props} />);
  return <div className="octave h-full w-full flex flex-col">{cells}</div>;
};

export default Octave;
