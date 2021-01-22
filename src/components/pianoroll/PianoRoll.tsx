import React, { ReactElement } from "react";
import Roll from "./Roll";
import SelectLayer from "./SelectLayer";
import { GridProvider } from "./GridContext";
import { SelectionProvider } from "./SelectionContext";
import ActionLayer from "./ActionLayer";

type Prop = {
  urlRoot: string;
};
const PianoRoll: React.FC<Prop> = ({ urlRoot }): ReactElement => {
  return (
    <div className="relative h-full">
      <GridProvider>
        <SelectionProvider>
          <ActionLayer></ActionLayer>
          <Roll urlRoot={`${urlRoot}/rest/1/rolls/`} rollId={1}></Roll>
          <SelectLayer></SelectLayer>
        </SelectionProvider>
      </GridProvider>
    </div>
  );
};

export default PianoRoll;
