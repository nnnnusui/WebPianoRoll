import React from "react";
import Context from "../context/Context";

const RollList: React.FC = () => {
  const rolls = Context.rolls.State();
  const setSelectedRollId = Context.roll.selectedId.Dispatch();
  const selectedRollId = Context.roll.selectedId.State();

  const lines = Array.from(rolls).map(([id, props]) => {
    const onClick = () => {
      setSelectedRollId(id);
    };
    const color = id == selectedRollId ? "bg-gray-300" : "";
    return (
      <div key={id} className={`${color}`} onClick={onClick}>
        roll _ {id} : {props.division}
      </div>
    );
  });

  return (
    <section className="relative w-full">
      <h1 className="text-center">selector</h1>
      {lines}
    </section>
  );
};

export default RollList;
