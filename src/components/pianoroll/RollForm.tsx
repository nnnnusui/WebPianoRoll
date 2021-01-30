import React, { useEffect, useState } from "react";
import Context from "./context/Context";

const RollForm: React.FC = () => {
  const setRolls = Context.rolls.Dispatch();
  const rolls = Context.rolls.State();
  const selectedRollId = Context.roll.selectedId.State();
  const [division, setDivision] = useState<number>(4);
  useEffect(() => {
    const selectedRoll = rolls.get(selectedRollId);
    if (selectedRoll == undefined) return;
    setDivision(selectedRoll.division);
  }, [rolls, selectedRollId]);

  const onDivisionChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDivision(Number(event.target.value));
  const onCreateClick = () => {
    setRolls({ type: "create", request: { division } });
  };

  return (
    <form className="flex flex-col">
      <label className="flex flex-row items-end text-sm">
        division:
        <input
          type="number"
          value={division}
          placeholder="division"
          className="w-full text-right"
          onChange={onDivisionChange}
        />
      </label>
      <input
        type="button"
        value="create"
        className="w-full"
        onClick={onCreateClick}
      />
    </form>
  );
};
export default RollForm;
