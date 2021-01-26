import React, { useState, useEffect } from "react";
import SoundRest from "./rest/SoundRest";

type Prop = {
  urlRoot: string;
};
const AudioPlayer: React.FC<Prop> = ({ urlRoot }) => {
  const [sound, setSound] = useState<Array<number>>();
  const rest = SoundRest(`${urlRoot}/1`);
  useEffect(() => {
    rest.get().then((it) => setSound(it.pcm));
  }, []);
  if (sound == undefined) return <></>;

  const context = new AudioContext();
  const source = context.createBufferSource();
  const channel = 1;
  const length = 5 * context.sampleRate;
  const buffer = context.createBuffer(channel, length, context.sampleRate);
  buffer.getChannelData(0).set(sound);
  source.buffer = buffer;
  source.connect(context.destination);

  const onClick = () => {
    source.start(0);
  };

  return (
    <div>
      <h1>{context.sampleRate}</h1>
      <input className="w-20 h-20" type="button" onClick={onClick}></input>
    </div>
  );
};
export default AudioPlayer;
