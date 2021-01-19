import React from "react";

type Props = {
  offset: number;
  octave: number;
  pitch: number;
};
const Cell: React.FC<Props> = ({ children, offset, octave, pitch }) => (
  <div>
    <div onClick={() => console.log(`${offset}, ${octave}, ${pitch}`)}>
      nyoa {pitch}
    </div>
    <div>{children}</div>
  </div>
);

export default Cell;
