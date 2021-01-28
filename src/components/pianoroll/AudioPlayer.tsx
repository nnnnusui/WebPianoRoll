import React, { useState } from "react";
import SoundRest from "./rest/SoundRest";
import PutNote from "./contexts/PutNoteContext";

type Prop = {
  url: string;
};
const AudioPlayer: React.FC<Prop> = ({ url }) => {
  // console.log("rerender: AudioPlayer");
  const selectedRollId = PutNote.Contexts.selectedRollId.State();
  const [audio, setAudio] = useState<AudioBufferSourceNode>();
  const rest = SoundRest(`${url}/${selectedRollId}`);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const context = new AudioContext();
      const sampleRate = context.sampleRate;
      rest.get(sampleRate).then((sound) => {
        console.log(sound);
        const length = sound.length;
        const channel = 1;
        const buffer = context.createBuffer(channel, length, sampleRate);
        buffer.getChannelData(0).set(sound.pcm);
        const source = context.createBufferSource();
        source.buffer = buffer;
        const gainNode = context.createGain();
        gainNode.gain.value = 0.5;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.loop = true;
        source.start();
        setAudio(source);
      });
    } else {
      audio?.stop();
    }
  };

  return (
    <div>
      <input
        className="w-full h-20"
        type="checkbox"
        onChange={onChange}
      ></input>
    </div>
  );
};
export default AudioPlayer;
