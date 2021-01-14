
class Elm {
    pianoroll() {
        const element = document.createElement('article') as HTMLElement;
        element.setAttribute("class", "pianoroll");
        element.appendChild(this.background());
        return element;
    }
    background() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "background");
        [...Array(1).keys()]
            .map(_ => this.octave())
            .forEach(it => element.appendChild(it));
        return element;
    }
    octave() {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "octave");
        [...Array(12).keys()]
            .map(_ => this.line())
            .forEach(it => element.appendChild(it));
        return element;
    }
    line(): HTMLElement {
        const element = document.createElement('div') as HTMLElement;
        element.setAttribute("class", "line");
        return element;
    }
}

document.body.appendChild(new Elm().pianoroll())
