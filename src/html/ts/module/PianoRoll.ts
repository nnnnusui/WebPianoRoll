import { CssProperty } from "./CssProperty.js";

export class PianoRoll {
    static generate(row_init: number, column_init: number): PianoRoll {
        const element = document.createElement('article') as HTMLElement;
        element.setAttribute("class", "pianoroll");
        const row = new CssProperty(element, "--row", row_init);
        const column = new CssProperty(element, "--column", column_init);
        const vertical_magnification = new CssProperty(element, "--vertical-magnification", 0);
        const horizontal_magnification = new CssProperty(element, "--horizontal-magnification", 0);
        return new PianoRoll(element, row, column, vertical_magnification, horizontal_magnification);
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

    constructor(
            element: HTMLElement, row: CssProperty<number>, column: CssProperty<number>
            , vertical_magnification: CssProperty<number>
            , horizontal_magnification: CssProperty<number>
        ) {
        this.element = element;
        this._row = CssProperty.fromComputed(element, "--row", CssProperty.toNumber);
        this._column = column;
        this._vertical_magnification = vertical_magnification;
        this._horizontal_magnification = horizontal_magnification;
    }
}
