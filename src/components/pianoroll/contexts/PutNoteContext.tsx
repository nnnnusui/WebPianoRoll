import React from "react";
import GenerateContext from "../../GenerateContext";

type Source = {
  type: "Note" | "ActionCell";
  index: number;
};
const Contexts = {
  from: GenerateContext({} as Source),
  to: GenerateContext({} as Source),
  apply: GenerateContext<boolean>(false),
};
const Providers: React.FC = ({ children }) => (
  <Contexts.from.Provider>
    <Contexts.to.Provider>
      <Contexts.apply.Provider>{children}</Contexts.apply.Provider>
    </Contexts.to.Provider>
  </Contexts.from.Provider>
);
const PutNote = { Contexts, Providers };
export default PutNote;
