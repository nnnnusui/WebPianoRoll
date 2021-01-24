import typedFetch from "../../typedFetch";

type NoteRest = NoteCreate;
type NoteCreate = {
  length: number;
} & NoteKeys;
type NoteKeys = {
  offset: number;
  octave: number;
  pitch: number;
};

const Notes = (rootUrl: string) => {
  const url = `${rootUrl}/notes`;
  const getAll = () => typedFetch<{ values: Array<NoteRest> }>(url);
  const create = (note: NoteKeys) => {
    console.log(note);
    return typedFetch<NoteRest>(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
  };
  const remove = (keys: NoteKeys) =>
    typedFetch(
      `${url}?offset=${keys.offset}&octave=${keys.octave}&pitch=${keys.pitch}`,
      {
        method: "DELETE",
      }
    );

  return { getAll, create, remove };
};

export default Notes;
