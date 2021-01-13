
const pianoroll = document.getElementsByClassName("pianoroll")[0] as HTMLElement;
const column = 25;
const row = 50;
pianoroll.style.setProperty("--column", `${column}`);
pianoroll.style.setProperty("--row", `${row}`);

const background = pianoroll.getElementsByClassName("background")[0] as HTMLElement;
const background_cell = document.createElement('div') as HTMLElement;
[...Array(column * row).keys()]
    .map(_ => {
        const cell = background_cell.cloneNode() as HTMLElement;
        cell.addEventListener("click", event => {
            const target = event.target as HTMLElement;
            const parent = target.parentElement as HTMLElement;
            const index = Array.from(parent.children).indexOf(target);
            
            const rowIndex = index / column;
            const columnIndex = index % column;
            console.log(`index: ${index}, row: ${rowIndex}, column: ${columnIndex}`);
            // ここにNote追加処理
        });
        return cell;
    })
    .forEach(it => background.appendChild(it))
const test = {...background_cell};
