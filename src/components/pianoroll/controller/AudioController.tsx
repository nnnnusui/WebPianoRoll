import React, { useState } from "react";
import Rest from "../rest/Rest";
import Context from "../context/Context";

type Props = {
  rest: ReturnType<typeof Rest>["sound"];
};
const AudioController: React.FC<Props> = ({ rest }) => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const rollId = Context.roll.selectedId.State();
  const [audio, setAudio] = useState<AudioBufferSourceNode>();
  const [tempo, setTempo] = useState<number>(130);
  const [beat, setBeat] = useState<number>(4);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const context = new AudioContext();
      const sampleRate = context.sampleRate;
      rest(rollId)
        .get(sampleRate, tempo, beat)
        .then((sound) => {
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
    <section>
      <h1 className="text-center">AudioController</h1>
      <form className="w-full">
        <input
          className="w-full h-20"
          type="checkbox"
          onChange={onChange}
        ></input>
        <label className="flex flex-row items-end text-sm">
          tempo:
          <input
            placeholder="tempo"
            type="number"
            value={tempo}
            className="w-full text-right"
            onChange={(event) => setTempo(Number(event.target.value))}
          />
        </label>
        <label className="flex flex-row items-end text-sm">
          beat:
          <input
            placeholder="beat"
            type="number"
            value={beat}
            className="w-full text-right"
            onChange={(event) => setBeat(Number(event.target.value))}
          />
        </label>
      </form>
    </section>
  );
};
export default AudioController;
