import typedFetch from "../../typedFetch";

type SoundRest = {
  pcm: Array<number>;
};
const SoundRest = (rootUrl: string) => {
  const url = `${rootUrl}/sound`;
  const get = () => typedFetch<SoundRest>(`${url}`);
  return { url, get };
};

export default SoundRest;
