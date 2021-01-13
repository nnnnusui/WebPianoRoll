
const pianoroll = document.getElementsByClassName("pianoroll")[0] as HTMLElement;
const row = 50;
const column = 25;
let vertical_magnification = 0;
let horizontal_magnification = 0;
pianoroll.style.setProperty("--row", `${row}`);
pianoroll.style.setProperty("--column", `${column}`);
pianoroll.style.setProperty("--vertical-magnification", `${vertical_magnification}`);
pianoroll.style.setProperty("--horizontal-magnification", `${horizontal_magnification}`);

const note_container = document.createElement('section') as HTMLElement;
note_container.setAttribute("class", "note-container");
pianoroll.appendChild(note_container);
const note_template = document.createElement('div') as HTMLElement;

const background = pianoroll.getElementsByClassName("background")[0] as HTMLElement;
const background_cell_template = document.createElement('div') as HTMLElement;
[...Array(column * row).keys()]
    .map(_ => {
        const cell = background_cell_template.cloneNode() as HTMLElement;
        cell.addEventListener("click", event => {
            const target = event.target as HTMLElement;
            const parent = target.parentElement as HTMLElement;
            const index = Array.from(parent.children).indexOf(target);
            
            const rowIndex = Math.floor(index / column) + 1;
            const columnIndex = index % column + 1;
            console.log(`index: ${index}, row: ${rowIndex}, column: ${columnIndex}`);
            const note = note_template.cloneNode() as HTMLElement;
            note.style.setProperty("grid-row", `${rowIndex}`);
            note.style.setProperty("grid-column", `${columnIndex}`);
            note_container.appendChild(note);
        });
        return cell;
    })
    .forEach(it => background.appendChild(it))


let ctrl = false;
document.addEventListener("keyup", event => ctrl = event.ctrlKey);
document.addEventListener("keydown", event => ctrl = event.ctrlKey);
window.addEventListener("mousewheel", event => ctrl ? event.preventDefault() : {}, { passive: false })
pianoroll.onwheel = (event: WheelEvent) => {
    if (!event.ctrlKey) return;
    const plusOrMinusOrZero = (it: number) => {
        if (it < 0) return -1;
        if (it > 0) return  1;
        return 0;
    }
    const y = plusOrMinusOrZero(event.deltaY);
    const x = plusOrMinusOrZero(event.deltaX);
    const after_vertical = vertical_magnification + y;
    const after_horizontal = horizontal_magnification + x;

    if (after_vertical >= 0)
        vertical_magnification = after_vertical;
    if (after_horizontal >= 0)
        horizontal_magnification = after_horizontal;
    pianoroll.style.setProperty("--vertical-magnification", `${vertical_magnification}`);
    pianoroll.style.setProperty("--horizontal-magnification", `${horizontal_magnification}`);
}

