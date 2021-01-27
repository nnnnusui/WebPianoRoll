import React, { useState } from "react";
import SoundRest from "./rest/SoundRest";

type Prop = {
  urlRoot: string;
};
const AudioPlayer: React.FC<Prop> = ({ urlRoot }) => {
  // console.log("rerender: AudioPlayer");
  const [audio, setAudio] = useState<AudioBufferSourceNode>();
  const [checked, setChecked] = useState(false);
  const rest = SoundRest(`${urlRoot}/1`);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (checked) {
      audio?.stop();
    } else {
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
        source.start();
        setAudio(source);
      });
    }
    setChecked(!checked);
  };

  return (
    <div>
      <input className="w-20 h-20" type="checkbox" onClick={onClick}></input>
    </div>
  );
};
export default AudioPlayer;
