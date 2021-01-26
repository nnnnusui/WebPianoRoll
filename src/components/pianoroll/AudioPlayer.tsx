import React, { useState, useEffect } from "react";
import SoundRest from "./rest/SoundRest";

type Prop = {
  urlRoot: string;
};
const AudioPlayer: React.FC<Prop> = ({ urlRoot }) => {
  console.log("rerender: AudioPlayer");
  const [oscillator, setOscillator] = useState<OscillatorNode>();
  const [audio, setAudio] = useState<{
    context: AudioContext;
    gainNode: GainNode;
  }>();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const context = new AudioContext();
    const sampleRate = context.sampleRate;

    const rest = SoundRest(`${urlRoot}/1`);
    rest.get(sampleRate).then((sound) => {
      const length = sound.length;
      const channel = 1;
      const buffer = context.createBuffer(channel, length, sampleRate);
      buffer.getChannelData(0).set(sound.pcm);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.value = 0.5;
      setAudio({ context, gainNode });
      oscillator?.stop();
    });
  }, []);
  if (audio == undefined) return <></>;

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (checked) {
      oscillator?.stop();
    } else {
      const oscillator = audio.context.createOscillator();
      oscillator.connect(audio.gainNode);
      oscillator.start();
      setOscillator(oscillator);
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
