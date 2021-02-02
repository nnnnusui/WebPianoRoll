import React from "react";
import Context from "../context/Context";
import RollListCell from "./RollListCell";
import ActionListeners from "../grid/ActionListeners";

const RollList: React.FC = () => {
  const rolls = Array.from(Context.rolls.State());
  const actionListeners = ActionListeners();

  return (
    <section className="relative w-full" {...actionListeners}>
      <h1 className="text-center">selector</h1>
      {rolls.map(([id]) => (
        <RollListCell key={id} rollId={id} />
      ))}
    </section>
  );
};

export default RollList;
