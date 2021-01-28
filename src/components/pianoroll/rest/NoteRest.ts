import typedFetch from "./typedFetch";

type NoteRestType = NoteKeys & NoteCreate;
type NoteCreate = {
  offset: number;
  octave: number;
  pitch: number;
  length: number;
  childRollId: number | null;
};
type NoteKeys = {
  id: number;
};

const NoteRest = (rootUrl: string) => {
  const url = `${rootUrl}/notes`;
  const getAll = () =>
    typedFetch<{ values: Array<NoteRestType> }>(url).then(
      (result) => result.values
    );
  const create = (note: NoteCreate) => {
    return typedFetch<NoteRestType>(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
  };

  const update = (input: NoteRestType) =>
    typedFetch(`${url}/${input.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  const remove = (keys: NoteKeys) =>
    typedFetch(`${url}/${keys.id}`, {
      method: "DELETE",
    });

  return { getAll, create, update, remove };
};

export default NoteRest;
export type { NoteRestType };
