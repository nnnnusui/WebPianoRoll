import { CssProperty } from "./CssProperty.js";
import { Background } from "./pianoroll/Background.js";

export class PianoRoll {
    private readonly length: number;

    private constructor(length: number) {
        this.length = length;
    }
}
class Element {
    static class_name: string = "pianoroll";
    private readonly piano_roll: PianoRoll;
    constructor(piano_roll: PianoRoll) {
        this.piano_roll = piano_roll;
    }
    generate(): HTMLElement {
        const element = document.createElement('article') as HTMLElement;
        element.setAttribute("class", Element.class_name);
        [...Array(12).keys()]
            .map(_ => document.createElement('div'))
            .forEach(it => element.appendChild(it));
        return element;
    }
    // static generateTo(parent: HTMLElement, row_size: number, column_size: number): PianoRoll {
    //     parent.appendChild(element);
    //     element.style.setProperty("--row", `${row_size}`);
    //     element.style.setProperty("--column", `${column_size}`);

    //     const piano_roll = new PianoRoll(element);
    //     piano_roll.row = row_size;
    //     piano_roll.column = column_size;
    //     const background = Background.generateTo(element, piano_roll);
    //     element.appendChild(background.element);
    //     return piano_roll;
    // }

}