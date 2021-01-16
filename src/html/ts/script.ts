
class Contents {
    background: Background
    constructor(private piano_roll: PianoRoll) {
        this.background = new Background(this.piano_roll)
    }
    element() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "contents");
        element.appendChild(this.background.element());
        // element.appendChild(this.note_container());
        return element;
    }
}
class Background {
    bars: Bar[]
    constructor(private piano_roll: PianoRoll) {
        this.bars = 
            [...Array(this.piano_roll.length).keys()]
                .map(_ => new Bar(this.piano_roll));
    }
    element() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "background");
        this.bars
            .map(it => it.element())
            .forEach(it => element.appendChild(it));
        return element;
    }
}
class Bar {
    time_index_cells: TimeIndexCell[]
    constructor(private piano_roll: PianoRoll) {
        this.time_index_cells = 
            [...Array(4).keys()]
                .map(_ => new TimeIndexCell(this.piano_roll));
    }
    element() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        this.time_index_cells
            .map(it => it.element())
            .forEach(it => element.appendChild(it));
        return element;
    }
}
class TimeIndexCell {
    octaves: Octave[]
    constructor(private piano_roll: PianoRoll) {
        this.octaves =
            [...Array(3).keys()]
                .map(_ => new Octave(this.piano_roll));
    }
    element() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        this.octaves
            .map(it => it.element())
            .forEach(it => element.appendChild(it));
        return element;
    }
}
class Octave {
    cells: Cell[]
    constructor(private piano_roll: PianoRoll) {
        this.cells = 
            [...Array(12).keys()]
                .map(_ => new Cell(this.piano_roll));
    }
    element() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "octave");
        this.cells
            .map(it => it.element())
            .forEach(it => element.appendChild(it));
        return element;
    }
}
class Cell {
    constructor(private piano_roll: PianoRoll) {}
    element() {
        const element = document.createElement('div') as HTMLElement;
        element.classList.add("cell");
        element.oncontextmenu = _ => false;
        element.onmousedown = this.onclick.bind(this);
        return element;
    }
    private onclick(event: MouseEvent) {
        const left_click = 0;
        const right_click = 2;
        const target = event.target as HTMLElement;
        switch(event.button) {
            case left_click: this.piano_roll.put_note(this); break;
            case right_click: target.classList.remove("puted");break;
        }
        return false;
    }
}
class PianoRoll {
    public beat: number = 4
    public contents: Contents
    constructor(public length: number, public octave_size: number = 3) {
        this.contents = new Contents(this)
    }

    put_note(from: Cell) {
        this.contents
            .background
            .bars
        console.log(from)
    }

    element() {
        const element = document.createElement('article') as HTMLElement;
        element.setAttribute("class", "pianoroll");
        element.appendChild(this.header());
        element.appendChild(this.contents.element());
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
        element.oncontextmenu = _ => false;
        element.onmousedown = this.onclick.bind(this);
        return element;
    }
    private onclick(event: MouseEvent) {
        const left_click = 0;
        const right_click = 2;
        const target = event.target as HTMLElement;
        switch(event.button) {
            // case left_click: this.parent.put_note(this.time_index, this.pitch_index); break;//target.classList.add("puted");break;
            case right_click: target.classList.remove("puted");break;
        }
        return false;
    }
}


document.body.appendChild(new PianoRoll(4).element())
