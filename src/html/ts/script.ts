
const pianoroll = document.getElementsByClassName("pianoroll")[0] as HTMLElement;
const column = 25;
const row = 50;
pianoroll.style.setProperty("--column", `${column}`);
pianoroll.style.setProperty("--row", `${row}`);

const background = pianoroll.getElementsByClassName("background")[0] as HTMLElement;
[...Array(column * row).keys()].forEach(index=> background.appendChild(document.createElement('div')))
