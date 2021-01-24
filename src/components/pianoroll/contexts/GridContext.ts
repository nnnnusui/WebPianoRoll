import GenerateContext from "../../GenerateContext";

type GridInfo = {
  width: number;
  height: number;
};
const initialState: GridInfo = { width: 24, height: 12 };

const Grid = GenerateContext(initialState);
export default Grid;
