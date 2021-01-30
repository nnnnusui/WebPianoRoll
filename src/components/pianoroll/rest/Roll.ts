import typedFetch from "./typedFetch";

const post = <T>(body: T) => ({
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

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
    update: (request: Data) =>
      typedFetch<Data>(`${url}/${request.id}`, post(request)),
  };
};
export default Roll;
export type { Data as RollRestData };
export type { Primaries as RollRestPrimaries };
export type { Others as RollRestOthers };
