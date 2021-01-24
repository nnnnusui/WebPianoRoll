import React from "react";
import GenerateContext from "../../GenerateContext";

const PutNoteMode = {
    read: "read",
    fire: "fire",
} as const
type PutNoteMode = typeof PutNoteMode[keyof typeof PutNoteMode]
const Contexts = {
  from: GenerateContext({ x: 0, y: 0 }),
  to: GenerateContext({ x: 0, y: 0 }),
  mode: GenerateContext<PutNoteMode>(PutNoteMode.read),
};
const Providers: React.FC = ({ children }) => (
  <Contexts.from.Provider>
    <Contexts.to.Provider>
        <Contexts.mode.Provider>{children}</Contexts.mode.Provider>
    </Contexts.to.Provider>
  </Contexts.from.Provider>
);
const PutNote = { Contexts, Providers };
export default PutNote;
export {PutNoteMode}
