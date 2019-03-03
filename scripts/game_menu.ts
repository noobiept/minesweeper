import * as Options from "./options.js";
import { restart } from "./minesweeper.js";

let TIMER_VALUE: HTMLElement;

/**
 * Initialize the game menu module.
 */
export function init() {
    // :: column size :: //
    const columnSize = document.getElementById(
        "ColumnSize"
    ) as HTMLInputElement;
    const columnSizeValue = document.getElementById("ColumnSizeValue")!;
    const columnSizeStr = Options.getOption("columnSize").toString();

    columnSize.value = columnSizeStr;
    columnSizeValue.innerHTML = columnSizeStr;
    columnSize.oninput = function() {
        columnSizeValue.innerHTML = columnSize.value;
    };
    columnSize.onchange = function() {
        const currentColumnSize = parseInt(columnSize.value, 10);
        Options.setOption("columnSize", currentColumnSize);
    };

    // :: line size :: //
    const lineSize = document.getElementById("LineSize") as HTMLInputElement;
    const lineSizeValue = document.getElementById("LineSizeValue")!;
    const lineSizeStr = Options.getOption("lineSize").toString();

    lineSize.value = lineSizeStr;
    lineSizeValue.innerHTML = lineSizeStr;
    lineSize.oninput = function() {
        lineSizeValue.innerHTML = lineSize.value;
    };
    lineSize.onchange = function() {
        const currentLineSize = parseInt(lineSize.value, 10);
        Options.setOption("lineSize", currentLineSize);
    };

    // :: number of mines :: //
    const numberOfMines = document.getElementById(
        "NumberOfMines"
    ) as HTMLInputElement;
    const numberOfMinesValue = document.getElementById("NumberOfMinesValue")!;
    const numberOfLinesStr = Options.getOption("numberOfMines").toString();

    numberOfMines.value = numberOfLinesStr;
    numberOfMinesValue.innerHTML = numberOfLinesStr;
    numberOfMines.oninput = function() {
        numberOfMinesValue.innerHTML = numberOfMines.value;
    };
    numberOfMines.onchange = function() {
        const currentNumberOfMines = parseInt(numberOfMines.value, 10);
        Options.setOption("numberOfMines", currentNumberOfMines);
    };

    // :: restart :: //
    var restartButton = document.getElementById("Restart")!;
    restartButton.onclick = restart;

    // :: timer :: //
    TIMER_VALUE = document.getElementById("TimerValue")!;

    // show the menu/high-score
    const menu = document.getElementById("Menu")!;
    const highScore = document.getElementById("HighScore")!;

    menu.classList.remove("hidden");
    highScore.classList.remove("hidden");
}

/**
 * Update the timer UI element with a new value.
 */
export function updateTimer(displayValue: string) {
    TIMER_VALUE.innerHTML = displayValue;
}
