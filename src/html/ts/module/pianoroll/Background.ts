import { PianoRoll } from "../PianoRoll.js";
import { BackgroundCell } from "./BackgroundCell.js";

export class Background {
    static class_name: string = "background";
    static generateTo(parent: HTMLElement, piano_roll: PianoRoll): Background {
        const element = document.createElement('section') as HTMLElement;
        parent.appendChild(element);
        element.setAttribute("class", this.class_name);
        const cells = [...Array(piano_roll.column * piano_roll.row).keys()]
            .map(_=> BackgroundCell.generate(piano_roll));
        cells.forEach(cell=> element.appendChild(cell.element))
        return new Background(element, cells);
    }
    static fromParent(parent: HTMLElement): Background {
        const element = parent.getElementsByClassName(this.class_name)[0] as HTMLElement;
        return this.fromElement(element);
    }
    static fromElement(element: HTMLElement): Background {
        const cells = BackgroundCell.fromParent(element);
        return new Background(element, cells);
    }
    readonly element: HTMLElement;
    readonly cells: BackgroundCell[];

    private constructor(element: HTMLElement, cells: BackgroundCell[]) {
        this.element = element;
        this.cells = cells;
    }
}
