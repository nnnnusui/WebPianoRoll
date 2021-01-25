import React, { ReactElement, useEffect, useState } from "react";
import Roll, { RollProps } from "./Roll";
import SelectLayer from "./layer/SelectLayer";
import ActionLayer from "./layer/ActionLayer";
import Grid from "./contexts/GridContext";
import PutNote from "./contexts/PutNoteContext";
import RollRest from "./rest/RollRest";
import AudioPlayer from "./AudioPlayer";

type Prop = {
  urlRoot: string;
};
const PianoRoll: React.FC<Prop> = ({ urlRoot }): ReactElement => {
  const [roll, setRoll] = useState<RollProps>();
  useEffect(() => {
    const { url, get } = RollRest(`${urlRoot}/rest/1`);
    const rollId = 1;
    get(rollId).then((result) => {
      const maxPitch = 12;
      const maxOffset = result.division;
      const minOctave = -1;
      const maxOctave = 1;
      setRoll({ url, rollId, maxOffset, minOctave, maxOctave, maxPitch });
    });
  }, [urlRoot]);
  if (roll == undefined) return <></>;
  return (
    <div className="relative h-full">
      <Grid.Provider>
        <PutNote.Providers>
          <AudioPlayer></AudioPlayer>
          <ActionLayer></ActionLayer>
          <Roll {...roll}></Roll>
          <SelectLayer></SelectLayer>
        </PutNote.Providers>
      </Grid.Provider>
    </div>
  );
};

export default PianoRoll;
