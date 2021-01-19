import React from "react";
import { NextPage } from "next";
import Bar from "../components/pianoroll/Bar";

const Home: NextPage = () => {
  return <Bar maxOffset={5} minOctave={-1} maxOctave={1}></Bar>;
};

export default Home;
