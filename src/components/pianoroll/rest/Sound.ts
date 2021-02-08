import typedFetch from "./typedFetch";

type Data = {
  length: number;
  pcm: Array<number>;
};
const Sound = (url: string) => {
  return {
    get: (sampleRate: number, tempo: number, beat: number) =>
      typedFetch<Data>(
        `${url}?sample_rate=${sampleRate}&tempo=${tempo}&beat=${beat}`
      ),
  };
};
export default Sound;
