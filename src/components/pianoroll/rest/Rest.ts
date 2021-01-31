import Note from "./Note";
import Roll from "./Roll";

const Rest = (urlRoot: string, apiVersion = 1) => {
  const url = `${urlRoot}/rest/${apiVersion}`;
  return {
    roll: Roll(`${url}/rolls`),
    note: (rollId: number) => Note(`${url}/rolls/${rollId}/notes`),
  };
};
export default Rest;
