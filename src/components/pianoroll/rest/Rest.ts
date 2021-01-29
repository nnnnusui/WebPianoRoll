import typedFetch from "./typedFetch";

const Rest = (urlRoot: string, apiVersion = 1) => {
  const url = `${urlRoot}/rest/${apiVersion}`;
  return {
    roll: Roll.rest(`${url}/rolls`),
  };
};
export default Rest;

namespace Roll {
  type Data = Primaries & Others;
  type Primaries = {
    id: number;
  };
  type Others = {
    division: number;
  };
  export const rest = (url: string) => {
    console.log(url);
    return {
      getAll: () =>
        typedFetch<{ values: Array<Data> }>(url).then(
          (result) => result.values
        ),
    };
  };
}
