import React from "react";
import ActionListeners from "./grid/ActionListeners";
import Grid from "./canvas/Grid";

const View: React.FC = () => {
  const actionListeners = ActionListeners();

  return (
    <div className="relative h-full w-full" {...actionListeners}>
      <div className="absolute h-full w-full">
        <Grid />
      </div>
    </div>
  );
};
export default View;
