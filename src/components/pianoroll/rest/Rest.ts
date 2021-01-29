import Roll from "./Roll";

const Rest = (urlRoot: string, apiVersion = 1) => {
  const url = `${urlRoot}/rest/${apiVersion}`;
  return {
    roll: Roll(`${url}/rolls`),
  };
};
export default Rest;
