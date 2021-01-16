import { Bar } from "./Bar.js";

export class PianoRoll {
    _element: HTMLElement = document.createElement("div");
    set element(value: HTMLElement) {
        this._element.remove();
        document.body.appendChild(value);
        this._element = value;
    }
    bars: Bar[]
    constructor(public length: number, public octave_size: number = 0) {
        this.bars =
            [...Array(this.length).keys()]
                .map(_ => new Bar());
    }

    draw() {
        this.element = this.to_element()
    }
    add_bar() {
        this.bars.push(new Bar())
        this.draw()
    }
    add_note() {
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
        this.bars
            .map(it => this.bar(it))
            .forEach(it => element.appendChild(it));
        return element;
    }
    
    bar_header() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar-header");
        element.onclick = event => {
            this.add_bar();
        }
        // [...Array(4).keys()]
        //     .map(_ => this.cell())
        //     .forEach(it => element.appendChild(it));
        return element;
    }

    bar(bar: Bar) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        bar.lines
            .map(_ => this.time_index_cell())
            .forEach(it => element.appendChild(it));
        return element;
    }
    time_index_cell() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        [...Array(this.octave_size).keys()]
            .reverse()
            .map(index => octave_length - index)
            .map(index => this.octave())
            .forEach(it => element.appendChild(it));
        return element;
    }
    octave() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "octave");
        [...Array(12).keys()]
            .map(index => this.cell())
            .forEach(it => element.appendChild(it));
        return element;
    }
    cell(): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("cell");
        element.appendChild(this.background());
        return element;
    }
    background(): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("background");
        element.onclick = event => {
            const target = event.target as HTMLElement;
            target.parentElement?.appendChild(this.note());
        }
        return element;
    }
    note(): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("note");
        element.onclick = event => {
            const target = event.target as HTMLElement;
            target.remove();
        }
        return element;
    }
}
