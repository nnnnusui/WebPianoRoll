import GenerateContext from "../GenerateContext";

type SelectionInfo = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

const initialState: SelectionInfo = {
  from: { x: 0, y: 0 },
  to: { x: 0, y: 0 },
};

const { Provider, UseContext } = GenerateContext(initialState);
export { Provider as SelectionProvider, UseContext as useSelectionContext };
