import React from "react";
import GenerateContext from "../../GenerateContext";

type PutNoteEvent =
  | {
      type: "none";
    }
  | {
      type: "fromActionCell";
    }
  | {
      type: "fromNote";
      index: number;
    };
const Contexts = {
  from: GenerateContext({ x: 0, y: 0 }),
  to: GenerateContext({ x: 0, y: 0 }),
  apply: GenerateContext<boolean>(false),
  event: GenerateContext<PutNoteEvent>({ type: "none" }),
};
const Providers: React.FC = ({ children }) => (
  <Contexts.from.Provider>
    <Contexts.to.Provider>
      <Contexts.event.Provider>
        <Contexts.apply.Provider>{children}</Contexts.apply.Provider>
      </Contexts.event.Provider>
    </Contexts.to.Provider>
  </Contexts.from.Provider>
);
const PutNote = { Contexts, Providers };
export default PutNote;
