import typedFetch from "../../typedFetch";

type NoteRest = NoteCreate;
type NoteCreate = {
    length: number;
} & NoteKeys
type NoteKeys = {
    offset: number;
    octave: number;
    pitch: number;
}

const maxPitch = 12
const Notes = (rootUrl: string) => {
    const url = `${rootUrl}/notes`
    const getAll = () =>
        typedFetch<{ values: Array<NoteRest> }>(url)
        // .then((result) => {
        //     initNotes(
        //         result.values.map(it=> {
        //             const pos = { x: it.offset, y: it.octave * maxPitch + it.pitch }
        //             return { pos, length: 1 }
        //         })
        //     )
        // })
    
    const create = (note: NoteKeys) =>{
        console.log(note)
        return typedFetch<NoteRest>(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
          })}
        //   .then(it=> setId(it.id));
    
    const remove = (keys: NoteKeys) =>
        typedFetch(`${url}?offset=${keys.offset}&octave=${keys.octave}&pitch=${keys.pitch}`, {
            method: "DELETE"
        })
    


    return { getAll, create, remove }
}

const getKeysFromPos = (pos: {x: number, y: number}): NoteKeys => {
    const offset = pos.x
    const octave = Math.floor(pos.y / maxPitch)
    const pitch = pos.y % maxPitch
    return {offset, octave, pitch}
}

export default Notes
export {getKeysFromPos}