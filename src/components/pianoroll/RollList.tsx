import React, { useState, useEffect } from "react";
import RollRest, { RollRestType } from "./rest/RollRest";
import PutNote from "./contexts/PutNoteContext";

type Prop = {
  urlRoot: string;
  setRollId: React.Dispatch<React.SetStateAction<number>>;
};
const selfType = "RollList";
const RollList: React.FC<Prop> = ({ urlRoot, setRollId }) => {
  const [rolls, setRolls] = useState<Array<RollRestType>>();
  const rest = RollRest(urlRoot);
  const putNote = {
    setFrom: PutNote.Contexts.from.Dispatch(),
    setTo: PutNote.Contexts.to.Dispatch(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };
  useEffect(() => {
    rest.getAll().then((result) => {
      setRolls(result);
      if (result.length != 0) setRollId(result[0].id);
    });
  }, []);
  if (rolls == undefined) return <></>;

  const list = rolls.map((roll) => {
    const rollId = roll.id;
    const onMouseDown = (event: React.MouseEvent) => {
      event.preventDefault();
      putNote.setFrom({ type: selfType, rollId });
    };
    const onMouseUp = (event: React.MouseEvent) => {
      event.preventDefault();
      putNote.setTo({ type: selfType, rollId });
      setRollId(rollId);
    };
    return (
      <li key={rollId} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        {rollId}
      </li>
    );
  });

  return (
    <article>
      <h1>rolls________</h1>
      <ul>{list}</ul>
    </article>
  );
};

export default RollList;
