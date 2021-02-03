import { useState } from "react";
import { Pos } from "../type/Pos";

const SelectionController = () => {
  const [on, setOn] = useState(false);
  const [from, setFrom] = useState({ x: 0, y: 0 });
  const [to, setTo] = useState({ x: 0, y: 0 });

  const start = (cell: Pos) => {
    setFrom(cell);
    setTo(cell);
    setOn(true);
  };
  const middle = (cell: Pos) => {
    if (!on) return;
    setTo(cell);
  };
  const end = () => {
    setOn(false);
  };
  return {
    state: { from, to },
    start,
    middle,
    end,
  };
};
export default SelectionController;
