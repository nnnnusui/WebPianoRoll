import { Bar } from "./Bar.js";

export class PianoRoll {
    bars: Bar[]
    constructor(public length: number, public octave_size: number = 3) {
        this.bars =
            [...Array(this.length).keys()]
                .map(_ => new Bar())
    }

    element() {
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
            .map(it => it.header_element())
            .forEach(it => element.appendChild(it));
        return element;
    }
    
    note_container() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "note-container");
        this.bars
            .map(it => it.content_element(this.octave_size))
            .forEach(it => element.appendChild(it));
        return element;
    }
}
