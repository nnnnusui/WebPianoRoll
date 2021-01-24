import typedFetch from "../../typedFetch";

type RollRest = {
  division: number;
};
const RollRest = (rootUrl: string) => {
  const url = `${rootUrl}/rolls`;
  console.log(url);
  const get = (id: number) => typedFetch<RollRest>(`${url}/${id}`);
  return { url, get };
};

export default RollRest;
