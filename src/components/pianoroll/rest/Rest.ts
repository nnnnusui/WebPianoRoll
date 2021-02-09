import Note from "./Note";
import Roll from "./Roll";
import Sound from "./Sound";

const Rest = (urlRoot: string, apiVersion = 1) => {
  const url = `${urlRoot}/rest/${apiVersion}`;
  return {
    roll: Roll(`${url}/rolls`),
    note: (rollId: number) => Note(`${url}/rolls/${rollId}/notes`),
    sound: (rollId: number) => Sound(`${url}/rolls/${rollId}/sound`),
  };
};
export default Rest;
