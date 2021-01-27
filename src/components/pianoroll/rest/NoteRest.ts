import typedFetch from "./typedFetch";

type NoteRestType = NoteCreate;
type NoteCreate = {
  sticky: boolean;
  childRollId: number | null;
} & NoteKeys;
type NoteKeys = {
  offset: number;
  octave: number;
  pitch: number;
};

const NoteRest = (rootUrl: string) => {
  const url = `${rootUrl}/notes`;
  const getAll = () => typedFetch<{ values: Array<NoteRestType> }>(url);
  const create = (notes: Array<NoteCreate>) => {
    return typedFetch<NoteRestType>(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notes),
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

export default NoteRest;
