import React, { useEffect } from "react";
import Context from "../context/Context";
import Note from "./Note";

type Props = {
  id: number;
  maxOffset: number;
  minOctave: number;
  maxOctave: number;
  maxPitch: number;
  width: number;
  height: number;
};
const Roll: React.FC<{ id: number }> = ({ id }) => {
  const roll = Context.rolls.State().get(id)?.data;
  const notes = Array.from(Context.notes.State().get(id) || []);
  if (roll == null) return <></>;

  const noteAction = Context.notes.Dispatch();
  useEffect(() => {
    noteAction({ type: "getAll", rollId: roll.id });
  }, [roll]);

  const style = {
    gridTemplateColumns: `repeat(${roll.width}, 1fr)`,
    gridTemplateRows: `repeat(${roll.height}, 1fr)`,
  };

  return (
    <div
      className="pointer-events-none absolute h-full w-full grid grid-flow-col"
      style={style}
    >
      <h1 className="">__roll {id}</h1>
      {notes.map(([noteId], index) => (
        <Note key={index} {...{ rollId: id, id: noteId }} />
      ))}
    </div>
  );
};
export default Roll;
export type { Props as RollProps };
