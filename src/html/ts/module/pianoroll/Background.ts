import { PianoRoll } from "../PianoRoll";

export class Background {
    static generate(pianoRoll: PianoRoll): Background {
        const element = document.createElement('section') as HTMLElement;
        element.setAttribute("class", "background");
        pianoRoll.row * pianoRoll.column
        return new Background(element);
    }
    readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }
}