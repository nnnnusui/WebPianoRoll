import React from "react";
import Context from "./context/Context";
import Roll from "./entity/Roll";
import ActionLayer from "./grid/layer/ActionLayer";

const View: React.FC = () => {
  const roll = Context.roll.selected();
  if (roll == undefined) return <></>;

  return (
    <div className="relative h-full w-full">
      <ActionLayer {...roll.props}/>
      <Roll {...roll.props}/>
    </div>
  );
};
export default View;
