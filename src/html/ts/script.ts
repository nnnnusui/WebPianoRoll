class PianoRoll {
    constructor(public length: number, public octave_size: number = 3) {}

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
        [...Array(this.length).keys()]
            .map(_ => this.bar_header())
            .forEach(it => element.appendChild(it));
        return element;
    }
    bar_header() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar-header");
        [...Array(this.length).keys()]
            .map(_ => this.cell())
            .forEach(it => element.appendChild(it));
        return element;
    }
    
    note_container() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "note-container");
        [...Array(this.length).keys()]
            .map(_ => this.bar())
            .forEach(it => element.appendChild(it));
        return element;
    }
    bar() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        [...Array(this.length).keys()]
            .map(index => this.time_index_cell())
            .forEach(it => element.appendChild(it));
        return element;
    }
    time_index_cell() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        [...Array(this.octave_size).keys()]
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

document.body.appendChild(new PianoRoll(4).element())
