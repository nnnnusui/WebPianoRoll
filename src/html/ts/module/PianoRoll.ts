import { CssProperty } from "./CssProperty.js";
import { Background } from "./pianoroll/Background.js";

export class PianoRoll {
    static class_name: string = "pianoroll";
    static generateTo(parent: HTMLElement, row_size: number, column_size: number): PianoRoll {
        const element = document.createElement('article') as HTMLElement;
        parent.appendChild(element);
        element.setAttribute("class", this.class_name);
        element.style.setProperty("--row", `${row_size}`);
        element.style.setProperty("--column", `${column_size}`);

        const piano_roll = new PianoRoll(element);
        piano_roll.row = row_size;
        piano_roll.column = column_size;
        const background = Background.generateTo(element, piano_roll);
        element.appendChild(background.element);
        return piano_roll;
    }
    static fromParent(parent: HTMLElement): PianoRoll {
        const element = parent.getElementsByClassName(this.class_name)[0] as HTMLElement;
        return this.fromElement(element);
    }
    static fromElement(element: HTMLElement): PianoRoll {
        const background = Background.fromParent(element);
        return new PianoRoll(element);
    }
    readonly element: HTMLElement;
    private readonly _row: CssProperty<number>;
    set row(value: number) { this._row.set(value) }
    private readonly _column: CssProperty<number>;
    set column(value: number) { this._column.set(value) }
    private readonly _vertical_magnification: CssProperty<number>;
    set vertical_magnification(value: number) { this._vertical_magnification.set(value); }
    private readonly _horizontal_magnification: CssProperty<number>;
    set horizontal_magnification(value: number) { this._horizontal_magnification.set(value); }

    // readonly background: Background;

    private constructor(element: HTMLElement) {
        this.element = element;

        this._row = CssProperty.fromComputed(element, "--row", CssProperty.toNumber);
        this._column = CssProperty.fromComputed(element, "--column", CssProperty.toNumber);
        this._vertical_magnification = CssProperty.fromComputed(element, "--vertical-magnification", CssProperty.toNumber);
        this._horizontal_magnification = CssProperty.fromComputed(element, "--horizontal-magnification", CssProperty.toNumber);
    }
    put_note(index: number) {
        const rowIndex = Math.floor(index / this.column) + 1;
        const columnIndex = index % this.column + 1;
        console.log(`row: ${rowIndex}, column: ${columnIndex}`);
    //     const note = note_template.cloneNode() as HTMLElement;
    //     note.style.setProperty("grid-row", `${rowIndex}`);
    //     note.style.setProperty("grid-column", `${columnIndex}`);
    //     note_container.appendChild(note);
    }
}
