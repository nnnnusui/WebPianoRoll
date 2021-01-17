import { Note } from "./Note.js";
import { PianoRoll } from "./PianoRoll.js";

export class Bar {
    constructor(public piano_roll: PianoRoll, public division: number) {}
    add_division() {
        this.division += 1;
        this.piano_roll.draw()
    }

    
    bar_header() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar-header");
        element.onclick = event => {
            this.add_division();
        }
        // [...Array(4).keys()]
        //     .map(_ => this.cell())
        //     .forEach(it => element.appendChild(it));
        return element;
    }

    bar(bar_index: number, octave_size: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        [...Array(this.division).keys()]
            .map(index => this.time_index_cell(index, bar_index, octave_size))
            .forEach(it => element.appendChild(it));
        return element;
    }
    time_index_cell(time_index: number, bar_index: number, octave_size: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        const octave_count = octave_size * 2 + 1;
        [...Array(octave_count).keys()]
            .map(index => octave_size - index)
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
        this.piano_roll.notes
            .filter(it => it.same_pos(note))
            .map(it => it.element(this.piano_roll))
            .forEach(it => element.appendChild(it))
        return element;
    }
    background(note: Note): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("background");
        element.onclick = event => {
            const target = event.target as HTMLElement;
            this.piano_roll.add_note(note)
        }
        return element;
    }
}