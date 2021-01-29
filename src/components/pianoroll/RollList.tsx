import React, { useState, useEffect } from "react";
import RollRest, { RollRestType } from "./rest/RollRest";
import PutNote from "./contexts/PutNoteContext";

type Prop = {
  rolls: Array<RollRestType>;
  selectedRollId: number;
};
const selfType = "RollList";
const RollList: React.FC<Prop> = ({ rolls, selectedRollId }) => {

  const list = rolls.map((roll) => {
    const rollId = roll.id;
    const onMouseDown = (event: React.MouseEvent) => {
      event.preventDefault();
    };
    const onMouseUp = (event: React.MouseEvent) => {
      event.preventDefault();
    };
    const color = rollId == selectedRollId ? "bg-gray-300" : "";
    return (
      <li
        key={rollId}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={`${color}`}
      >
        {`${rollId}: ${roll.division}`}
      </li>
    );
  });

  return (
    <article className="relative w-full">
      <h1>Rolls</h1>
      <ul>{list}</ul>
    </article>
  );
};

export default RollList;
