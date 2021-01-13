export class CssProperty<T> {
    static fromComputed<T>(element: HTMLElement, property_name: string, typeConvert: (value: string) => T): CssProperty<T> {
        const currentValue = getComputedStyle(element).getPropertyValue(property_name);
        const value = typeConvert(currentValue);
        return new CssProperty(element, property_name, value);
    }
    static toNumber(value: string): number { return Number(value); }
    readonly element: HTMLElement;
    readonly property_name: string;
    private value: T;
    constructor(element: HTMLElement, property_name: string, init: T) {
        this.element = element;
        this.property_name = property_name;
        this.value = init;
    }
    set(value: T) {
        this.element.style.setProperty(this.property_name, `${this.value}`);
        this.value = value;
    }
    get(): T {
        return this.value;
    }
}
