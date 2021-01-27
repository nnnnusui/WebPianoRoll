import React, { ReactElement, useEffect, useState } from "react";
import Roll, { RollProps } from "./grid/layer/Roll";
import SelectLayer from "./grid/layer/SelectLayer";
import ActionLayer from "./grid/layer/ActionLayer";
import Grid from "./contexts/GridContext";
import RollRest from "./rest/RollRest";

type Prop = {
  urlRoot: string;
  rollId: number;
};
const PianoRoll: React.FC<Prop> = ({ urlRoot, rollId }): ReactElement => {
  // console.log(`rerender: PianoRoll _ roll_id: ${rollId}`);
  const [roll, setRoll] = useState<RollProps>();
  useEffect(() => {
    const { url, get } = RollRest(urlRoot);
    get(rollId).then((result) => {
      const maxPitch = 12;
      const maxOffset = result.division;
      const minOctave = -1;
      const maxOctave = 1;
      setRoll({ url, rollId, maxOffset, minOctave, maxOctave, maxPitch });
    });
  }, [urlRoot, rollId]);
  if (roll == undefined) return <></>;

  return (
    <div className="relative h-full w-full">
      <Grid.Provider>
        <ActionLayer></ActionLayer>
        <Roll {...roll}></Roll>
        <SelectLayer></SelectLayer>
      </Grid.Provider>
    </div>
  );
};

export default PianoRoll;
