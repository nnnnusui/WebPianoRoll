import React from "react";
import Time, { TimeInputs, TimeNeeds, TimeValues } from "./Time";
import { range0to } from "../../range";
import { CellValues } from "./Cell";

type Props = {
} & Inputs &
  Needs;
type Inputs = {
  maxOffset: number;
} & TimeInputs;
type Needs = TimeNeeds;

const Bar: React.FC<Props> = ({ maxOffset, ...props }) => {
  const times = range0to(maxOffset).map((index) => (
    <Time
      key={index}
      offset={index}
      {...props}
    />
  ));
  return <div className="bar flex h-full w-full">{times}</div>;
};

export default Bar;
