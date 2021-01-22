import GenerateContext from "../GenerateContext";

type GridInfo = {
  width: number;
  height: number;
};
const initialState: GridInfo = { width: 0, height: 0 };

const { Provider, UseContext } = GenerateContext(initialState);
export { Provider as GridProvider, UseContext as useGridContext };
