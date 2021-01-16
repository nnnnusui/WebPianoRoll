import { Bar } from "./Bar.js";

export class PianoRoll {
    _element: HTMLElement = document.createElement("div");
    set element(value: HTMLElement) {
        this._element.remove();
        document.body.appendChild(value);
        this._element = value;
    }
    bars: Bar[]
    notes: Note[] = Array()
    constructor(
        public length: number
        , public octave_size: number = 0
    ) {
        this.bars = [...Array(length).keys()]
            .map(_ => new Bar())
    }

    draw() {
        this.element = this.to_element();
    }
    add_octave() {
        this.octave_size += 1;
        this.draw()
    }
    add_bar() {
        this.length += 1;
        this.draw();
    }
    add_note(note: Note) {
        this.notes.push(note);
        this.draw()
    }
    remove_note(note: Note) {
        this.notes = this.notes.filter(it => !it.same_pos(note))
        this.draw()
    }

    to_element() {
        const element = document.createElement('article') as HTMLElement;
        element.setAttribute("class", "pianoroll");
        element.appendChild(this.header());
        element.appendChild(this.note_container());
        return element;
    }
    header() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "timeline-header");
        this.bars
            .map(it => this.bar_header())
            .forEach(it => element.appendChild(it));
        return element;
    }
    
    note_container() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "note-container");
        [...Array(this.length).keys()]
            .map(index => this.bar(index))
            .forEach(it => element.appendChild(it));
        return element;
    }
    
    bar_header() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar-header");
        element.onclick = event => {
            this.add_octave();
        }
        // [...Array(4).keys()]
        //     .map(_ => this.cell())
        //     .forEach(it => element.appendChild(it));
        return element;
    }

    bar(bar_index: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        [...Array(1).keys()]
            .map(index => this.time_index_cell(index, bar_index))
            .forEach(it => element.appendChild(it));
        return element;
    }
    time_index_cell(time_index: number, bar_index: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        const octave_count = this.octave_size * 2 + 1;
        [...Array(octave_count).keys()]
            .map(index => this.octave_size - index)
            .forEach(index => element.appendChild(this.octave(index, time_index, bar_index)));
        return element;
    }
    octave(octave_index: number, time_index: number, bar_index: number) {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("octave");
        [...Array(12).keys()]
            .reverse()
            .map(index => this.cell(index, octave_index, time_index, bar_index))
            .forEach(it => element.appendChild(it));
        return element;
    }
    cell(cell_index: number, octave_index: number, time_index: number, bar_index: number): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("cell");
        const note = new Note(bar_index, time_index, octave_index, cell_index)
        element.appendChild(this.background(note));
        this.notes
            .filter(it => it.same_pos(note))
            .forEach(_ => element.appendChild(this.note(note)))
        return element;
    }
    background(note: Note): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("background");
        element.onclick = event => {
            const target = event.target as HTMLElement;
            this.add_note(note)
        }
        return element;
    }
    note(note: Note): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("note");
        element.onclick = event => {
            const target = event.target as HTMLElement;
            this.remove_note(note)
        }
        return element;
    }
}

class Note {
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