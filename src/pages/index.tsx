import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import PianoRoll from "../components/pianoroll/PianoRoll";

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`${window.location.protocol}//${window.location.hostname}:8080`);
    window.addEventListener(
      "touchmove",
      (e: TouchEvent) => e.preventDefault(),
      { passive: false }
    );
  }, []);
  return <PianoRoll urlRoot={url} />;
};

export default Home;
