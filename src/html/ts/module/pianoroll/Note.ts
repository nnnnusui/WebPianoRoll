class Note {
    element: HTMLElement;
    constructor() {
        this.element = Note.element();
    }
    
    static element(): HTMLElement {
        return document.createElement('div') as HTMLElement;
    }
}
