import React, { useState, useRef } from "react";
import Context from "./context/Context";
import Roll from "./entity/Roll";
import ActionLayer from "./grid/layer/ActionLayer";
import ActionListeners from "./grid/ActionListeners";
import ActionConsumer from "./ActionConsumer";
import Grid from "./canvas/Grid";
import Select from "./grid/layer/Select";

const View: React.FC = () => {
  const selectedRollId = Context.roll.selectedId.State();
  const roll = Context.rolls.State().get(selectedRollId);
  const actionListeners = ActionListeners();
  if (roll == null) return <></>;

  return (
    <div className="relative h-full w-full" {...actionListeners}>
      {/* <ActionConsumer {...roll.data} />
      <ActionLayer {...roll.data} />
      <Roll {...roll.data} /> */}
      <div className="absolute h-full w-full">
        <Grid />
      </div>
    </div>
  );
};
export default View;
