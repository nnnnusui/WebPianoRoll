import post from "./post";
import typedFetch from "./typedFetch";

type Data = Primaries & Others;
type Primaries = {
  id: number;
};
type Others = {
  offset: number;
  octave: number;
  pitch: number;
  length: number;
  childRollId: number | null;
};
const Note = (url: string) => {
  return {
    getAll: () =>
      typedFetch<{ values: Array<Data> }>(url).then((result) => result.values),
    create: (body: Others) => typedFetch<Data>(url, post(body)),
    update: (request: Data) =>
      typedFetch<Data>(`${url}/${request.id}`, post(request)),
    delete: (request: Primaries) =>
      typedFetch<Data>(`${url}/${request.id}/`, { method: "DELETE" }),
  };
};
export default Note;
export type { Data as NoteRestData };
export type { Primaries as NoteRestPrimaries };
export type { Others as NoteRestOthers };
