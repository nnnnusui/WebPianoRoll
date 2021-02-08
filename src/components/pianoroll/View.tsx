import React from "react";
import Grid from "./canvas/Grid";

const View: React.FC = () => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute h-full w-full">
        <Grid />
      </div>
    </div>
  );
};
export default View;
