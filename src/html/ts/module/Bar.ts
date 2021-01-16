export class Bar {
    constructor() {}
    
    header_element() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar-header");
        [...Array(4).keys()]
            .map(_ => this.cell())
            .forEach(it => element.appendChild(it));
        return element;
    }
    content_element(octave_size: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "bar");
        [...Array(4).keys()]
            .map(index => this.time_index_cell(octave_size))
            .forEach(it => element.appendChild(it));
        return element;
    }
    time_index_cell(octave_size: number) {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "time-index-cell");
        [...Array(octave_size).keys()]
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