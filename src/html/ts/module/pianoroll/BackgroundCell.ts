import { PianoRoll } from "../PianoRoll";

export class BackgroundCell {
    static class_name: string = "background-cell";
    static generate(piano_roll: PianoRoll): BackgroundCell {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", this.class_name);
        new Event(piano_roll).addTo(element);
        return new BackgroundCell(element);
    }
    static fromParent(parent: HTMLElement): BackgroundCell[] {
        return Array.from(parent.getElementsByClassName(this.class_name))
            .map(it=> BackgroundCell.fromElement(it as HTMLElement));
    }
    static fromElement(element: HTMLElement): BackgroundCell {
        return new BackgroundCell(element);
    }
    readonly element: HTMLElement;
    
    constructor(element: HTMLElement) {
        this.element = element;
    }
}
class Event {
    private readonly piano_roll: PianoRoll;
    constructor(piano_roll: PianoRoll) {
        this.piano_roll = piano_roll;
    }
    addTo(element: HTMLElement) {
        element.onclick = this.onClick.bind(this);
    }
    private onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const parent = target.parentElement as HTMLElement;
        const index = Array.from(parent.children).indexOf(target);
        this.piano_roll.put_note(index);
    }
}
