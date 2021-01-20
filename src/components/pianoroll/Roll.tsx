import React, { useEffect, useState, ReactElement } from "react";
import Bar from "./contents/Bar";
import typedFetch from "../typedFetch";

type RollRest = {
  division: number;
};

const Roll = (): ReactElement => {
  const [division, setState] = useState(0);
  useEffect(() => {
    typedFetch<RollRest>(
      "http://localhost:8080/rest/1/rolls/1"
    ).then((result) => setState(result.division));
  });
  return <Bar maxOffset={division} minOctave={-1} maxOctave={1}></Bar>;
};

export default Roll;
