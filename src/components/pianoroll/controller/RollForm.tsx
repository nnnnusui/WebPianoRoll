import React, { useState } from "react";
import Context from "../context/Context";

const RollForm: React.FC = () => {
  const setRolls = Context.rolls.Dispatch();
  const selectedRoll = Context.roll.selected();
  const [division, setDivision] = useState<number>(selectedRoll?.division || 4);

  const onDivisionChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDivision(Number(event.target.value));
  const onCreateClick = () => {
    setRolls({ type: "create", request: { division } });
  };
  const onUpdateClick = () => {
    if (selectedRoll == undefined) return;
    setRolls({ type: "update", request: { id: selectedRoll.id, division } });
  };

  return (
    <form className="flex flex-col">
      <label className="flex flex-row items-end text-sm">
        id:
        <input
          placeholder="id"
          disabled={true}
          type="number"
          defaultValue={selectedRoll?.id}
          className="w-full text-right"
        />
      </label>
      <label className="flex flex-row items-end text-sm">
        division:
        <input
          placeholder="division"
          type="number"
          value={division}
          className="w-full text-right"
          onChange={onDivisionChange}
        />
      </label>
      <div className="flex flex-row">
        <input
          value="create"
          type="button"
          className="w-full"
          onClick={onCreateClick}
        />
        <input
          value="update"
          type="button"
          className="w-full"
          onClick={onUpdateClick}
        />
      </div>
    </form>
  );
};
export default RollForm;
