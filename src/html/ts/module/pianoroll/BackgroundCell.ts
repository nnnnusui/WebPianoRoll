import { Background } from "./Background";

export class BackgroundCell {
    static generate(): Background {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "background-cell");
        return new Background(element);
    }
    readonly element: HTMLElement;
    
    constructor(element: HTMLElement) {
        this.element = element;
    }
    // onClick(event: MouseEvent) {
    //     const target = event.target as HTMLElement;
    //     const parent = target.parentElement as HTMLElement;
    //     const index = Array.from(parent.children).indexOf(target);
        
    //     const rowIndex = Math.floor(index / this.column_size) + 1;
    //     const columnIndex = index % this.column_size + 1;
    //     const note = note_template.cloneNode() as HTMLElement;
    //     note.style.setProperty("grid-row", `${rowIndex}`);
    //     note.style.setProperty("grid-column", `${columnIndex}`);
    //     note_container.appendChild(note);
    // }
}
