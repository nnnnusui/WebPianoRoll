import React from "react";

type Props = {
  offset: number;
  octave: number;
  pitch: number;
};
const Cell: React.FC<Props> = ({ offset, octave, pitch }) => (
  <div className="relative cell h-full w-full">
    <div
      className="absolute h-full w-full flex-col-reverse bg-gray-600"
      onClick={() => console.log(`${offset}, ${octave}, ${pitch}`)}
    ></div>
  </div>
);

export default Cell;
