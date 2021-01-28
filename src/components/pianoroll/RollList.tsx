import React, { useState, useEffect } from "react";
import RollRest, { RollRestType } from "./rest/RollRest";
import PutNote from "./contexts/PutNoteContext";

type Prop = {
  urlRoot: string;
};
const selfType = "RollList";
const RollList: React.FC<Prop> = ({ urlRoot }) => {
  console.log("rerender: RollList");
  const rest = RollRest(urlRoot);

  const [rolls, setRolls] = useState<Array<RollRestType>>();
  const putNote = {
    setFrom: PutNote.Contexts.from.Dispatch(),
    setTo: PutNote.Contexts.to.Dispatch(),
    setApply: PutNote.Contexts.apply.Dispatch(),
    selectedRollId: PutNote.Contexts.selectedRollId.State(),
    setSelectedRollId: PutNote.Contexts.selectedRollId.Dispatch(),
  };
  const [division, setDivision] = useState<number>();
  const [createFired, setCreateFired] = useState(true);
  useEffect(() => {
    if (!createFired) return;
    setCreateFired(false);
    rest.getAll().then((result) => {
      setRolls(result);
      if (result.length != 0) putNote.setSelectedRollId(result[0].id);
    });
  }, [createFired]);
  if (rolls == undefined) return <></>;

  const onClick = () => {
    if (division == undefined) return;
    rest.create({ division }).then(result => {
      // const rollId = result.id
      // putNote.setFrom({ type: selfType, rollId });
      // putNote.setTo({ type: selfType, rollId });
      // putNote.setApply(true);
      setCreateFired(true)
    });
  };
  const list = rolls.map((roll) => {
    const rollId = roll.id;
    const onMouseDown = (event: React.MouseEvent) => {
      event.preventDefault();
      putNote.setFrom({ type: selfType, rollId });
    };
    const onMouseUp = (event: React.MouseEvent) => {
      event.preventDefault();
      putNote.setTo({ type: selfType, rollId });
      putNote.setApply(true);
    };
    const color = rollId == putNote.selectedRollId ? "bg-gray-300" : "";
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
      <div className="flex flex-row items-end ">
        <p className="text-sm">division:</p>
        <input
          type="number"
          placeholder="*division"
          onChange={(e) => setDivision(Number(e.target.value))}
          className="w-full text-right bg-gray-400"
        />
      </div>
      <input
        type="button"
        className="w-full bg-gray-400"
        value="create"
        onClick={onClick}
      />
      <ul>{list}</ul>
    </article>
  );
};

export default RollList;
