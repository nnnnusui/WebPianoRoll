import typedFetch from "../../typedFetch";

type SoundRest = {
  length: number;
  pcm: Array<number>;
};
const SoundRest = (rootUrl: string) => {
  const url = `${rootUrl}/sound`;
  const get = (sampleRate: number) =>
    typedFetch<SoundRest>(`${url}?sample_rate=${sampleRate}`);
  return { url, get };
};

export default SoundRest;
