import React from "react";

type Props = {
  stickLeft: boolean,
  stickRight: boolean,
}
type Values = {
  offset: number;
  octave: number;
  pitch: number;
  sticky: boolean;
};
const Note: React.FC<Props> = (stickLeft, stickRight) => (
  <div className={`absolute h-full w-full bg-yellow-500 ${stickLeft ? "rounded-l-md" : ""} ${stickRight ? "rounded-r-md" : ""}`}></div>
);

export default Note;
export type {Values as NoteValues};