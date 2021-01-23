import React from "react";
import GenerateContext from "../GenerateContext";

const SelectionMode = {
  none: "none",
  line: "line",
  range: "range",
} as const;
type SelectionMode = typeof SelectionMode[keyof typeof SelectionMode];

const Contexts = {
  from: GenerateContext({ x: 0, y: 0 }),
  to: GenerateContext({ x: 0, y: 0 }),
  mode: GenerateContext<SelectionMode>(SelectionMode.none),
};
const Providers: React.FC = ({ children }) => (
  <Contexts.from.Provider>
    <Contexts.to.Provider>
      <Contexts.mode.Provider>{children}</Contexts.mode.Provider>
    </Contexts.to.Provider>
  </Contexts.from.Provider>
);
//  Object.values(Contexts)
//   .reverse()
//   .map((it) => it.Provider)
//   .reduce<React.FC>((sum, Provider) => () => <Provider>{sum}</Provider>, ({children})=> <>{children}</>);
const Selection = { Contexts, Providers };
export default Selection;
export { SelectionMode };
