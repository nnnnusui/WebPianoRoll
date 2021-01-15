
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
            .map(_ => this.bar())
            .forEach(it => element.appendChild(it));
        return element;
    }

    bar() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        [...Array(4).keys()]
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
        element.oncontextmenu = _ => false;
        element.onmousedown = this.cell_onclick.bind(this);
        return element;
    }
    private cell_onclick(event: MouseEvent) {
        const left_click = 0;
        const right_click = 2;
        const target = event.target as HTMLElement;
        console.log(event.button)
        switch(event.button) {
            case left_click: target.classList.add("puted");break;
            case right_click: target.classList.remove("puted");break;
        }
        return false;
    }
}

document.body.appendChild(new Elm(4).pianoroll())
