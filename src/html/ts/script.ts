
const pianoroll = document.getElementsByClassName("pianoroll")[0] as HTMLElement;
const column = 25;
const row = 50;
pianoroll.style.setProperty("--column", `${column}`);
pianoroll.style.setProperty("--row", `${row}`);

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

