import React from "react";
import Time, { TimeInputs, TimeNeeds } from "./Time";

type Props = Inputs & Needs;
type Inputs = {
  maxOffset: number;
} & TimeInputs;
type Needs = TimeNeeds;
const Bar: React.FC<Props> = ({ maxOffset, ...props }) => {
  const times = [...Array(maxOffset)]
    .map((_, index) => index)
    .map((index) => <Time key={index} offset={index} {...props} />);
  return <div className="bar flex h-full w-full ">{times}</div>;
};

export default Bar;
