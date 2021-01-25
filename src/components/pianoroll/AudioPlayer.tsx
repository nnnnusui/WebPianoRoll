import React from "react";
import { range0to } from "../range";

const AudioPlayer = () => {
    const context = new AudioContext();
    console.log(context)
    var source = context.createBufferSource();
    const channel = 2
    const length = 5 * context.sampleRate
    const dataLs = range0to(length)
        .map(index=> Math.sin(2 * Math.PI * index * 440 / context.sampleRate));
    const dataRs = range0to(5 * context.sampleRate)
        .map(index=> 0);
    const buffer = context.createBuffer(channel, length, context.sampleRate)
    buffer.getChannelData(0).set(dataLs)
    buffer.getChannelData(1).set(dataRs)
    source.buffer = buffer
    source.connect(context.destination);
    const onClick = ()=> {
        source.start(0);
    }
    return <input className="w-20 h-20"
     type="button" onClick={onClick}></input>
}
export default AudioPlayer