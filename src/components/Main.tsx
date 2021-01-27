import React, { useEffect, useState } from "react";
import PianoRoll from "../components/pianoroll/PianoRoll";
import RollList from "../components/RollList";
import PutNote from "./pianoroll/contexts/PutNoteContext";
import AudioPlayer from "./pianoroll/AudioPlayer";

const Main: React.FC = () => {
  const [selectedRollId, setSelectedRollId] = useState<number>(-1);
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
  const pianoRoll =
    selectedRollId > 0 ? (
      <PianoRoll urlRoot={url} rollId={selectedRollId} />
    ) : (
      <></>
    );
  return (
    <div className="h-full w-full flex justify-between">
      <PutNote.Providers>
        <div className="h-full flex flex-col">
          <AudioPlayer url={`${url}/rolls/${selectedRollId}`}></AudioPlayer>
          <RollList urlRoot={url} setRollId={setSelectedRollId} />
        </div>
        {pianoRoll}
      </PutNote.Providers>
    </div>
  );
};

export default Main;
