import { Bar } from "./Bar.js";
import { Note } from "./Note.js";

export class PianoRoll {
    _element: HTMLElement = document.createElement("div");
    set element(value: HTMLElement) {
        this._element.remove();
        document.body.appendChild(value);
        this._element = value;
    }
    bars: Bar[] = Array()
    notes: Note[] = Array()
    constructor(
        public length: number
        , public octave_size: number = 0
    ) {
        this.bars = [...Array(length).keys()]
            .map(_ => new Bar(this, 1))
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
            .map(it => it.bar_header())
            .forEach(it => element.appendChild(it));
        return element;
    }
    
    note_container() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "note-container");
        for (let index = 0; index < this.bars.length; index++) {
            const bar = this.bars[index];
            const bar_element = bar.bar(index, this.octave_size);
            element.appendChild(bar_element)
        }
        return element;
    }
    
}
