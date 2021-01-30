import React from "react";
import ActionLayer from "../grid/layer/ActionLayer";

type Props = {
  id: number;
  division: number;
};
const Roll: React.FC<Props> = ({ id, division }) => {
  const maxOffset = division;
  const minOctave = 0;
  const maxOctave = 0;
  const maxPitch = 12;

  const octaveRange = maxOctave + 1 - minOctave;
  const height = octaveRange * maxPitch;
  const width = maxOffset;

  return (
    <div className="relative h-full w-full">
      <h1 className="absolute z-50">
        __roll {id} _ {division}
      </h1>
      <ActionLayer {...{ width, height }} />
    </div>
  );
};
export default Roll;
export type { Props as RollProps };
