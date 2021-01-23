import React, { ReactElement } from "react";
import Roll from "./Roll";
import SelectLayer from "./layer/SelectLayer";
import ActionLayer from "./layer/ActionLayer";
import Selection from "./contexts/SelectionContext";
import Grid from "./contexts/GridContext";

type Prop = {
  urlRoot: string;
};
const PianoRoll: React.FC<Prop> = ({ urlRoot }): ReactElement => {
  return (
    <div className="relative h-full">
      <Grid.Provider>
        <Selection.Providers>
          <ActionLayer></ActionLayer>
          <Roll urlRoot={`${urlRoot}/rest/1/rolls/`} rollId={1}></Roll>
          <SelectLayer></SelectLayer>
        </Selection.Providers>
      </Grid.Provider>
    </div>
  );
};

export default PianoRoll;
