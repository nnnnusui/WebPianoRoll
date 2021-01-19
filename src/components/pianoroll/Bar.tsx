import React from "react";
import Time, { TimeInputs } from "./Time";

type Props = Inputs;
type Inputs = {
  maxOffset: number;
} & TimeInputs;
const Bar: React.FC<Props> = ({ maxOffset, ...props }) => {
  const times = [...Array(maxOffset)]
    .map((_, index) => index)
    .reverse()
    .map((index) => <Time key={index} offset={index} {...props} />);
  return <div className="bar flex">{times}</div>;
};

export default Bar;
