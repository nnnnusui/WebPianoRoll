import range, { range0to } from "../../range";
import { Pos } from "../type/Pos";
import { Size } from "../type/Size";
import { useState } from "react";

const useGridState = (size: Size) => {
  const topHeaderHeight = 100;
  const [offset] = useState<Pos>({ x: 0, y: topHeaderHeight });
  return { size, offset };
};
export default useGridState;
