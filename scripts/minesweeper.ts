import * as HighScore from "./high_score.js";
import Grid from "./grid.js";
import Square, { SquareValue, SquareState } from "./square.js";
import { getAsset, addCanvasListeners, getCanvasRect } from "./main.js";
import Timer from "./timer.js";
import { getRandomInt, timeToString } from "./utilities.js";
import Dialog from "./dialog.js";

var GRID: Grid | null;
var COLUMN_SIZE = 9;
var LINE_SIZE = 9;
var NUMBER_OF_MINES = 10;
var TIMER: Timer;

var CURRENT_MOUSE_OVER: Square | null = null; // the current square element that is being highlighted

export function init() {
    HighScore.load();
    buildMap();
    initMenu();

    addCanvasListeners(mouseMove, mouseClick);
}

function initMenu() {
    // :: column size :: //
    const columnSize = document.getElementById(
        "ColumnSize"
    ) as HTMLInputElement;
    const columnSizeValue = document.getElementById("ColumnSizeValue")!;
    const columnSizeStr = COLUMN_SIZE.toString();

    columnSize.value = columnSizeStr;
    columnSizeValue.innerHTML = columnSizeStr;
    columnSize.oninput = function() {
        columnSizeValue.innerHTML = columnSize.value;
    };

    // :: line size :: //
    const lineSize = document.getElementById("LineSize") as HTMLInputElement;
    const lineSizeValue = document.getElementById("LineSizeValue")!;
    const lineSizeStr = LINE_SIZE.toString();

    lineSize.value = lineSizeStr;
    lineSizeValue.innerHTML = lineSizeStr;
    lineSize.oninput = function() {
        lineSizeValue.innerHTML = lineSize.value;
    };

    // :: number of mines :: //
    const numberOfMines = document.getElementById(
        "NumberOfMines"
    ) as HTMLInputElement;
    const numberOfMinesValue = document.getElementById("NumberOfMinesValue")!;
    const numberOfLinesStr = NUMBER_OF_MINES.toString();

    numberOfMines.value = numberOfLinesStr;
    numberOfMinesValue.innerHTML = numberOfLinesStr;
    numberOfMines.oninput = function() {
        numberOfMinesValue.innerHTML = numberOfMines.value;
    };

    // :: restart :: //
    var restartButton = document.getElementById("Restart")!;

    restartButton.onclick = function() {
        COLUMN_SIZE = parseInt(columnSize.value, 10);
        LINE_SIZE = parseInt(lineSize.value, 10);
        NUMBER_OF_MINES = parseInt(numberOfMines.value, 10);

        restart();
    };

    // :: timer :: //
    var timerValue = document.getElementById("TimerValue")!;
    TIMER = new Timer({ htmlElement: timerValue });

    // show the menu/high-score
    const menu = document.getElementById("Menu")!;
    const highScore = document.getElementById("HighScore")!;

    menu.classList.remove("hidden");
    highScore.classList.remove("hidden");
}

function buildMap() {
    GRID = new Grid({ columnSize: COLUMN_SIZE, lineSize: LINE_SIZE });

    var positions = [];
    var a;

    for (var column = 0; column < COLUMN_SIZE; column++) {
        for (var line = 0; line < LINE_SIZE; line++) {
            positions.push({
                column: column,
                line: line,
            });
        }
    }

    // add mines in random positions
    for (a = 0; a < NUMBER_OF_MINES; a++) {
        // when there's more bomb positions than there are squares in the grid
        if (positions.length === 0) {
            break;
        }

        var random = getRandomInt(0, positions.length - 1);
        var position = positions.splice(random, 1)[0];
        var square = GRID.getSquare(position.column, position.line)!;

        square.setValue(SquareValue.mine);
    }

    // add the numbers to the positions (number of mines in adjacent squares)
    GRID.forEachSquare(function(square) {
        if (square.value !== SquareValue.mine) {
            var minesAround = GRID!.minesAround(square.column, square.line);

            square.setValue(minesAround);
        }
    });

    // show the high-score for this combination of columns/lines/number of mines
    var scores = HighScore.get(COLUMN_SIZE, LINE_SIZE, NUMBER_OF_MINES);
    var scoreContainer = document.getElementById("HighScoreContainer")!;

    scoreContainer.innerHTML = "";

    if (scores === null) {
        scoreContainer.innerHTML = "No scores yet.";
    } else {
        for (a = 0; a < scores.length; a++) {
            var scoreElement = document.createElement("span");

            scoreElement.innerHTML = timeToString(scores[a]);
            scoreContainer.appendChild(scoreElement);
        }
    }
}

function restart() {
    if (GRID) {
        GRID.clear();
        GRID = null;
    }

    buildMap();
    TIMER.reset();
}

function revealSquare(square: Square) {
    if (!GRID) {
        throw new Error("Grid not available.");
    }

    GRID.revealSquare(square);

    if (!TIMER.isActive()) {
        TIMER.start();
    }

    if (square.value == SquareValue.mine) {
        gameOver(false);
        return;
    }

    // need to reveal all the blank values around it
    if (square.value == SquareValue.blank) {
        var applyToAdjacents = function(aSquare: Square) {
            var adjacents = GRID!.getAdjacentSquares(
                aSquare.column,
                aSquare.line
            );

            for (var a = 0; a < adjacents.length; a++) {
                var adjacent = adjacents[a];

                if (adjacent.state !== SquareState.revealed) {
                    GRID!.revealSquare(adjacent);

                    if (adjacent.value === SquareValue.blank) {
                        applyToAdjacents(adjacent);
                    }
                }
            }
        };

        applyToAdjacents(square);
    }

    // check if the game is won (when the un-revealed squares are all mines)
    var finishLoop = true;

    for (var a = 0; a < GRID.hidden_squares.length; a++) {
        if (GRID.hidden_squares[a].value !== SquareValue.mine) {
            finishLoop = false;
            break;
        }
    }

    if (finishLoop) {
        gameOver(true);
    }
}

function revealAllMines() {
    if (!GRID) {
        throw new Error("Grid not available");
    }

    GRID.forEachSquare(function(square) {
        if (square.value === SquareValue.mine) {
            GRID!.revealSquare(square);
        }
    });
}

/**
 * Update the selected square on mouse move.
 */
function mouseMove(event: MouseEvent) {
    if (!GRID) {
        throw new Error("Grid not available");
    }

    var canvasRect = getCanvasRect();

    var x = event.clientX - canvasRect.left;
    var y = event.clientY - canvasRect.top;

    var column = Math.floor(x / Square.size);
    var line = Math.floor(y / Square.size);

    var square = GRID.getSquare(column, line);

    if (square) {
        if (CURRENT_MOUSE_OVER && square !== CURRENT_MOUSE_OVER) {
            CURRENT_MOUSE_OVER.unSelect();
        }

        CURRENT_MOUSE_OVER = square;
        square.select();
    } else {
        if (CURRENT_MOUSE_OVER) {
            CURRENT_MOUSE_OVER.unSelect();
            CURRENT_MOUSE_OVER = null;
        }
    }
}

/**
 * Reveal the current selected square on mouse left click.
 * Flag the square on right click (question mark/mine flag/hidden).
 */
function mouseClick(event: MouseEvent) {
    if (CURRENT_MOUSE_OVER) {
        var button = event.button;

        if (CURRENT_MOUSE_OVER.state == SquareState.revealed) {
            return;
        }

        // left click
        if (button == 0) {
            if (CURRENT_MOUSE_OVER.state == SquareState.mine_flag) {
                return;
            }

            revealSquare(CURRENT_MOUSE_OVER);
        }

        // right click
        else if (button == 2) {
            if (CURRENT_MOUSE_OVER.state === SquareState.hidden) {
                CURRENT_MOUSE_OVER.setState(SquareState.question_mark);
            } else if (CURRENT_MOUSE_OVER.state === SquareState.question_mark) {
                CURRENT_MOUSE_OVER.setState(SquareState.mine_flag);
            } else {
                CURRENT_MOUSE_OVER.setState(SquareState.hidden);
            }

            // the .setState() sets the background to hidden, but when we click we have the mouse over, so need to set to that image
            CURRENT_MOUSE_OVER.background.image = getAsset("hidden_mouse_over");
        }
    }
}

function gameOver(victory: boolean) {
    TIMER.stop();
    revealAllMines();

    let text = "";

    if (victory) {
        var time = TIMER.getElapsedTime();
        HighScore.add(COLUMN_SIZE, LINE_SIZE, NUMBER_OF_MINES, time);

        text = "You Win! " + timeToString(time);
    } else {
        text = "Defeat!";
    }

    const dialog = new Dialog({
        title: "Game Over!",
        body: text,
        buttonText: "Restart",
        onClose: () => {
            dialog.remove();
            restart();
        },
    });
}
