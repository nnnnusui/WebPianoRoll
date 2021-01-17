import { PianoRoll } from "./PianoRoll";

export class Note {
    constructor(
        public bar: number
        , public start: number
        , public octave: number
        , public pitch: number
        , public length: number = 1
    ) {}
    same_pos(note: Note) {
        return this.bar == note.bar
            && this.start == note.start
            && this.octave == note.octave
            && this.pitch == note.pitch;
    }

    element(piano_roll: PianoRoll) {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("note");
        element.onclick = event => {
            const target = event.target as HTMLElement;
            piano_roll.remove_note(this)
        }
        return element;
    }
}