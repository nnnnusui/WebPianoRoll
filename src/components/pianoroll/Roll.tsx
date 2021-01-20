import React, { useEffect, useState, ReactElement } from "react";
import Bar from "./contents/Bar";
import typedFetch from "../typedFetch";

type RollRest = {
  division: number;
};
type Note = {
  offset: number;
  octave: number;
  pitch: number;
};
const rollUrl = "http://localhost:8080/rest/1/rolls/1";
const onCellClick = (offset: number, octave: number, pitch: number) => {
  const note: Note = { offset, octave, pitch };
  typedFetch<Note>(`${rollUrl}/notes`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  }).then((it) => console.log(it));
};
const Roll = (): ReactElement => {
  const [division, setState] = useState(0);
  useEffect(() => {
    typedFetch<RollRest>(rollUrl).then((result) => setState(result.division));
  });
  return (
    <Bar
      maxOffset={division}
      minOctave={-1}
      maxOctave={1}
      event={onCellClick}
    ></Bar>
  );
};

export default Roll;
