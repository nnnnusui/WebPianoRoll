import React from "react";
import GenerateContext from "../../GenerateContext";

type Source =
  | {
      type: "Note" | "ActionCell";
      gridIndex: number;
    }
  | {
      type: "RollList";
      rollId: number;
    };
const Contexts = {
  from: GenerateContext({} as Source),
  to: GenerateContext({} as Source),
  apply: GenerateContext<boolean>(false),
  selectedRollId: GenerateContext(0),
};
const Providers: React.FC = Object.values(Contexts)
  .reverse()
  .map((it) => it.Provider)
  .reduce<React.FC>(
    (Sum, Provider) => ({ children }) =>
      Provider({ children: Sum({ children }) }),
    ({ children }) => <>{children}</>
  );

const PutNote = { Contexts, Providers };
export default PutNote;
