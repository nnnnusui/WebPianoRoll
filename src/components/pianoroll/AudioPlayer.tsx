import React, { useState } from "react";
import SoundRest from "./rest/SoundRest";

type Prop = {
  url: string;
};
const AudioPlayer: React.FC<Prop> = ({ url }) => {
  // console.log("rerender: AudioPlayer");
  const [audio, setAudio] = useState<AudioBufferSourceNode>();
  const rest = SoundRest(url);

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
      <input className="w-20 h-20" type="checkbox" onChange={onChange}></input>
    </div>
  );
};
export default AudioPlayer;
