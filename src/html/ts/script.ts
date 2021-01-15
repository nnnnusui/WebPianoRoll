
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
        element.appendChild(this.background());
        element.appendChild(this.note_containers())
        return element;
    }
    background() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "background");
        [...Array(this.length).keys()]
            .map(_ => this.time_index_cell(true))
            .forEach(it => element.appendChild(it));
        return element;
    }
    note_containers() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "note-containers");
        element.appendChild(this.note_container());
        return element;
    }
    note_container() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "note-container");
        [...Array(this.length).keys()]
            .map(_ => this.time_index_cell(false))
            .forEach(it => element.appendChild(it));
        return element;
    }

    time_index_cell(cell_generate: boolean) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        [...Array(this.octave_size).keys()]
            .map(_ => this.octave(cell_generate))
            .forEach(it => element.appendChild(it));
        return element;
    }
    octave(cell_generate: boolean) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "octave");
        if(cell_generate)
            [...Array(12).keys()]
                .map(_ => this.cell())
                .forEach(it => element.appendChild(it));
        return element;
    }
    cell(): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "cell");
        return element;
    }
}

document.body.appendChild(new Elm(12).pianoroll())
