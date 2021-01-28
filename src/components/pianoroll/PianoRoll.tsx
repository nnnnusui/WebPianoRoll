import React, { ReactElement, useEffect, useState } from "react";
import Roll, { RollProps } from "./grid/layer/Roll";
import SelectLayer from "./grid/layer/SelectLayer";
import ActionLayer from "./grid/layer/ActionLayer";
import Grid from "./contexts/GridContext";
import RollRest from "./rest/RollRest";
import PutNote from "./contexts/PutNoteContext";

type Prop = {
  urlRoot: string;
};
const PianoRoll: React.FC<Prop> = ({ urlRoot }): ReactElement => {
  // console.log(`rerender: PianoRoll _ roll_id: ${rollId}`);
  const selectedRollId = PutNote.Contexts.selectedRollId.State();
  const [roll, setRoll] = useState<RollProps>();
  useEffect(() => {
    if (selectedRollId < 1) return;
    const { url, get } = RollRest(urlRoot);
    get(selectedRollId).then((result) => {
      const rollId = result.id;
      const maxPitch = 12;
      const maxOffset = result.division;
      const minOctave = -1;
      const maxOctave = 1;
      setRoll({ url, rollId, maxOffset, minOctave, maxOctave, maxPitch });
    });
  }, [urlRoot, selectedRollId]);
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
