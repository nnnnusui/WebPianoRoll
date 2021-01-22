import GenerateContext from "../GenerateContext";

const SelectionMode = {
  none: "none",
  line: "line",
  range: "range",
} as const;
type SelectionMode = typeof SelectionMode[keyof typeof SelectionMode]

type SelectionInfo = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  mode: SelectionMode;
};

const initialState: SelectionInfo = {
  from: { x: 0, y: 0 },
  to: { x: 0, y: 0 },
  mode: SelectionMode.none,
};

const { Provider, UseContext } = GenerateContext(initialState);
export { Provider as SelectionProvider, UseContext as useSelectionContext };
export { SelectionMode }
