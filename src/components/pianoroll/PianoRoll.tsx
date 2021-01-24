import React, { ReactElement } from "react";
import Roll from "./Roll";
import SelectLayer from "./layer/SelectLayer";
import ActionLayer from "./layer/ActionLayer";
import Grid from "./contexts/GridContext";
import PutNote from "./contexts/PutNoteContext";

type Prop = {
  urlRoot: string;
};
const PianoRoll: React.FC<Prop> = ({ urlRoot }): ReactElement => {
  return (
    <div className="relative h-full">
      <Grid.Provider>
        <PutNote.Providers>
          <ActionLayer></ActionLayer>
          <Roll urlRoot={`${urlRoot}/rest/1/rolls/`} rollId={1}></Roll>
          <SelectLayer></SelectLayer>
        </PutNote.Providers>
      </Grid.Provider>
    </div>
  );
};

export default PianoRoll;
