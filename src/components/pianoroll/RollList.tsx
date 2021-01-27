import React, { useState, useEffect } from "react";
import RollRest, { RollRestType } from "./rest/RollRest";
import PutNote from "./contexts/PutNoteContext";

type Prop = {
  urlRoot: string;
  setRollId: React.Dispatch<React.SetStateAction<number>>;
};
const selfType = "RollList";
const RollList: React.FC<Prop> = ({ urlRoot, setRollId }) => {
  console.log("rerender: RollList");
  const rest = RollRest(urlRoot);
  const [division, setDivision] = useState<number>();
  const [createFired, setCreateFired] = useState(true);
  const onClick = () => {
    if (division == undefined) return;
    rest.create({ division }).then(() => setCreateFired(true));
  };

  const [rolls, setRolls] = useState<Array<RollRestType>>();
  const putNote = {
    setFrom: PutNote.Contexts.from.Dispatch(),
    setTo: PutNote.Contexts.to.Dispatch(),
    setApply: PutNote.Contexts.apply.Dispatch(),
  };
  useEffect(() => {
    if (!createFired) return;
    setCreateFired(false);
    rest.getAll().then((result) => {
      setRolls(result);
      if (result.length != 0) setRollId(result[0].id);
    });
  }, [createFired]);
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
        {`${rollId}: ${roll.division}`}
      </li>
    );
  });

  return (
    <article className="relative w-full">
      <h1>Rolls</h1>
      <input
        type="number"
        placeholder="*division"
        onChange={(e) => setDivision(Number(e.target.value))}
      />
      <input
        type="button"
        className="w-full"
        value="create"
        onClick={onClick}
      />
      <ul>{list}</ul>
    </article>
  );
};

export default RollList;
