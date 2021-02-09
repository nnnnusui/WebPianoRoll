import React from "react";
import Context from "../context/Context";
import RollListCell from "./RollListCell";

const RollList: React.FC = () => {
  const rolls = Array.from(Context.rolls.State());
  return (
    <section className="relative w-full">
      <h1 className="text-center">selector</h1>
      {rolls.map(([id]) => (
        <RollListCell key={id} rollId={id} />
      ))}
    </section>
  );
};

export default RollList;
