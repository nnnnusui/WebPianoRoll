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
  };
};
export default Roll;
