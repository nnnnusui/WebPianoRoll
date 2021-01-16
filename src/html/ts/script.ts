
class Elm {
    readonly element: HTMLElement
    constructor(public length: number, public octave_size: number = 3) {
        this.element = this.pianoroll()
    }

    put_note(source: HTMLElement) {
        console.log(source)
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
    
    contents() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "contents");
        element.appendChild(this.background());
        // element.appendChild(this.note_container());
        return element;
    }
    background() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "background");
        [...Array(this.length).keys()]
            .map(_ => this.bar())
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

    bar(row: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        [...Array(this.length).keys()]
            .map(index => this.time_index_cell(row * (index + 1)))
            .forEach(it => element.appendChild(it));
        return element;
    }
    time_index_cell(row: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        [...Array(this.octave_size).keys()]
            .map(index => this.octave(row, index))
            .forEach(it => element.appendChild(it));
        return element;
    }
    octave(row: number, column: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "octave");
        [...Array(12).keys()]
            .map(index => this.cell(row, column * (index + 1)))
            .forEach(it => element.appendChild(it));
        return element;
    }
    cell(row: number, column: number): HTMLElement {
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
        switch(event.button) {
            case left_click: this.put_note(target); break;//target.classList.add("puted");break;
            case right_click: target.classList.remove("puted");break;
        }
        return false;
    }
}

document.body.appendChild(new Elm(4).element)
