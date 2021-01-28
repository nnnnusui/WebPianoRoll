import React, { useEffect, useState } from "react";
import PianoRoll from "./PianoRoll";
import RollList from "./RollList";
import PutNote from "./contexts/PutNoteContext";
import AudioPlayer from "./AudioPlayer";

const Main: React.FC = () => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(
      `${window.location.protocol}//${window.location.hostname}:8080/rest/1`
    );
    window.addEventListener(
      "touchmove",
      (e: TouchEvent) => e.preventDefault(),
      { passive: false }
    );
  }, []);
  if (url == "") return <></>;

  return (
    <div className="h-full w-full flex justify-between">
      <PutNote.Providers>
        <div className="h-full w-20 flex flex-col bg-gray-400">
          <AudioPlayer url={`${url}/rolls/`}></AudioPlayer>
          <RollList urlRoot={url} />
        </div>
        <PianoRoll urlRoot={url} />
      </PutNote.Providers>
    </div>
  );
};

export default Main;
