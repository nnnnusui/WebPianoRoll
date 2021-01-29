import typedFetch from "./typedFetch";

type RollRestType = RollKeys & RollCreate;
type RollCreate = {
  division: number;
};
type RollKeys = {
  id: number;
};
const RollRest = (rootUrl: string) => {
  const url = `${rootUrl}/rolls`;

  const getAll = () =>
    typedFetch<{ values: Array<RollRestType> }>(url).then(
      (result) => result.values
    );
  const create = (body: RollCreate) =>
    typedFetch<RollRestType>(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  const get = (id: number) => typedFetch<RollRestType>(`${url}/${id}`);
  const update = (input: RollRestType) =>
    typedFetch<RollRestType>(`${url}/${input.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  return { url, getAll, create, get, update };
};

export default RollRest;
export type { RollRestType };
