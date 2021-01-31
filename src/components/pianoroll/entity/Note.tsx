import React from "react";

type Props = {
  rollId: number;
  id: number;
  offset: number;
  octave: number;
  pitch: number;
  length: number;
  childRollId: number | null;
};
const Note: React.FC<Props> = ({ id, ...props }) => {
  return (
    <div>
      note {id} _ {props}
    </div>
  );
};
export default Note;
export type { Props as NoteProps };
