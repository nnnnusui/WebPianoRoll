import React, { useState } from "react";
import Context from "./context/Context";

const RollForm: React.FC = () => {
  const setRolls = Context.rolls.Dispatch();
  const [division, setDivision] = useState<number>();

  const onDivisionChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDivision(Number(event.target.value));
  const onCreateClick = () => {
    if (division == undefined) return;
    setRolls({ type: "create", parameter: { division } });
  };

  return (
    <form className="flex flex-col">
      <label className="flex flex-row items-end text-sm">
        division:
        <input
          type="number"
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
