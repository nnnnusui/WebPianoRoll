import React, { ReactElement } from "react";
import Roll from "./Roll";
import SelectLayer from "./SelectLayer";
import ActionLayer from "./ActionLayer";
import Selection from "./SelectionContext";
import Grid from "./GridContext";

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
