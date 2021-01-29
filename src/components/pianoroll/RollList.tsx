import React from "react";
import Context from "./context/Context";

const RollList: React.FC = () => {
  const rolls = Context.rolls.State();
  console.log(rolls);
  return (
    <article className="relative w-full">
      <h1>Rolls</h1>
      {rolls}
    </article>
  );
};

export default RollList;
