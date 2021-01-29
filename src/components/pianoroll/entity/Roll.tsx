import React from "react";

type Props = {
  id: number;
  division: number;
};
const Roll: React.FC<Props> = ({ id, division }) => {
  return (
    <div>
      roll {id} _ {division}
    </div>
  );
};
export default Roll;
export type { Props as RollProps };
