import typedFetch from "./typedFetch";

type Data = {
  length: number;
  pcm: Array<number>;
};
const Sound = (url: string) => {
  return {
    get: (sampleRate: number) =>
      typedFetch<Data>(`${url}?sample_rate=${sampleRate}`),
  };
};
export default Sound;
