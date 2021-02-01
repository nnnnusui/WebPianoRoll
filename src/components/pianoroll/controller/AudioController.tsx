import React, { useState } from "react";
import Rest from "../rest/Rest";
import Context from "../context/Context";

type Props = {
  rest: ReturnType<typeof Rest>["sound"];
};
const AudioController: React.FC<Props> = ({ rest }) => {
  const rollId = Context.roll.selectedId.State();
  const [audio, setAudio] = useState<AudioBufferSourceNode>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const context = new AudioContext();
      const sampleRate = context.sampleRate;
      rest(rollId)
        .get(sampleRate)
        .then((sound) => {
          console.log(sound);
          const length = sound.length;
          const channel = 1;
          const buffer = context.createBuffer(channel, length, sampleRate);
          buffer.getChannelData(0).set(sound.pcm);
          const source = context.createBufferSource();
          source.buffer = buffer;
          const gainNode = context.createGain();
          gainNode.gain.value = 0.05;
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
    <div className="w-full">
      <input
        className="w-full h-20"
        type="checkbox"
        onChange={onChange}
      ></input>
    </div>
  );
};
export default AudioController;
