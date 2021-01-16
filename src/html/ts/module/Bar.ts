export class Bar {
    lines: Line[]
    constructor() {
        this.lines = [...Array(4).keys()]
            .map(_ => new Line())
    }
    
}
class Line {
    notes: number[]
    constructor() {

    }
}