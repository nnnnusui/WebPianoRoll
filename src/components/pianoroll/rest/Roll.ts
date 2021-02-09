import post from "./post";
import typedFetch from "./typedFetch";

type Data = Primaries & Others;
type Primaries = {
  id: number;
};
type Others = {
  division: number;
};
const Roll = (url: string) => {
  return {
    getAll: () =>
      typedFetch<{ values: Array<Data> }>(url).then((result) => result.values),
    create: (body: Others) => typedFetch<Data>(url, post(body)),
    get: (key: Primaries) => typedFetch<Data>(`${url}/${key.id}`),
    update: (request: Data) =>
      typedFetch<Data>(`${url}/${request.id}`, post(request)),
  };
};
export default Roll;
export type { Data as RollRestData };
export type { Primaries as RollRestPrimaries };
export type { Others as RollRestOthers };
