
class Elm {
    constructor(public length: number, public octave_size: number = 3) {

    }
    pianoroll() {
        const element = document.createElement('article') as HTMLElement;
        element.setAttribute("class", "pianoroll");
        element.appendChild(this.header());
        element.appendChild(this.contents());
        return element;
    }
    header() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "timeline-header");
        return element;
    }
    contents() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "contents");
        element.appendChild(this.note_container());
        return element;
    }
    note_container() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "note-container");
        [...Array(this.length).keys()]
            .map(_ => this.time_index_cell())
            .forEach(it => element.appendChild(it));
        return element;
    }

    time_index_cell() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        [...Array(this.octave_size).keys()]
            .map(_ => this.octave())
            .forEach(it => element.appendChild(it));
        return element;
    }
    octave() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "octave");
        [...Array(12).keys()]
            .map(_ => this.cell())
            .forEach(it => element.appendChild(it));
        return element;
    }
    cell(): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("cell");
        element.onclick = event => {
            const target = event.target as HTMLElement;
            target.classList.add("puted");
        }
        return element;
    }
}

document.body.appendChild(new Elm(12).pianoroll())
