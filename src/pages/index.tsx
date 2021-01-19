import React from "react";
import { NextPage } from "next";
import Bar from "../components/pianoroll/contents/Bar";

type Note = {
  offset: number;
  octave: number;
  pitch: number;
};
function get() {
  fetch("http://localhost:8080/rest/1/notes", { mode: `cors` }).then((it) =>
    console.log(it.json())
  );
}
function post() {
  const note: Note = {
    offset: 3,
    octave: 1,
    pitch: 1,
  };
  fetch("http://localhost:8080/rest/1/notes", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  }).then((it) => console.log(it.json()));
}

const Home: NextPage = () => {
  return <Bar maxOffset={5} minOctave={-1} maxOctave={1}></Bar>;
};

export default Home;
