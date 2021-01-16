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
}