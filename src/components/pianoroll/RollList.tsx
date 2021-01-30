import React from "react";
import Context from "./context/Context";
import Roll from "./entity/Roll";

const RollList: React.FC = () => {
  const rolls = Context.rolls.State();
  console.log(rolls);
  return (
    <article className="relative w-full">
      <h1>Rolls</h1>
      {Array.from(rolls).map(([id, props], index) => (
        <Roll key={index} {...props} />
      ))}
    </article>
  );
};

export default RollList;
