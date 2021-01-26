import React, { useEffect, useState } from "react";
import PianoRoll from "../components/pianoroll/PianoRoll";
import RollList from "../components/RollList";

const Main: React.FC = () => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`${window.location.protocol}//${window.location.hostname}:8080/rest/1`);
    window.addEventListener(
      "touchmove",
      (e: TouchEvent) => e.preventDefault(),
      { passive: false }
    );
  }, []);
  if (url == "") return <></>;
  return <>
    <RollList urlRoot={url}/>
    <PianoRoll urlRoot={url}/>
  </>;
};

export default Main;
