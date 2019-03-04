import * as HighScore from "./high_score.js";
import * as Options from "./options.js";
import * as GameMenu from "./game_menu.js";
import Dialog from "./dialog.js";
import Timer from "./timer.js";
import Grid, { GridPosition } from "./grid.js";
import Square, { SquareValue, SquareState } from "./square.js";
import { getAsset, addCanvasListeners, getCanvasRect } from "./main.js";
import { getRandomInt, timeToString } from "./utilities.js";

let GRID: Grid | null;
let TIMER: Timer;
let MINES_LEFT: number;
let CURRENT_MOUSE_OVER: Square | null = null; // the current square element that is being highlighted
let DIALOG: Dialog | undefined;

export function init() {
    HighScore.load();
    GameMenu.init();
    buildGrid();

    TIMER = new Timer({
        update: GameMenu.updateTimer,
    });

    addCanvasListeners(mouseMove, mouseClick);

    document.addEventListener("keydown", (event) => {
        if (event.key === "r") {
            // if there's a dialog open, let it deal with the event
            if (!DIALOG) {
                restart();
            }
        }
    });
}

/**
 * Build a new grid/map and update the high-score UI.
 */
function buildGrid() {
    const columnSize = Options.getOption("columnSize");
    const lineSize = Options.getOption("lineSize");
    MINES_LEFT = Options.getOption("numberOfMines");

    GRID = new Grid({ columnSize: columnSize, lineSize: lineSize });

    GameMenu.updateScores();
    GameMenu.updateMinesLeft(MINES_LEFT);
}

/**
 * Add the mines and the numbered positions to the map.
 */
export function placeMapValues(exclude: GridPosition) {
    if (!GRID) {
        throw new Error("Grid not available.");
    }

    const columnSize = Options.getOption("columnSize");
    const lineSize = Options.getOption("lineSize");
    const numberOfMines = Options.getOption("numberOfMines");
    const positions = [];

    // construct a list with the valid positions where we can place the mines
    for (let column = 0; column < columnSize; column++) {
        for (let line = 0; line < lineSize; line++) {
            if (column === exclude.column && line === exclude.line) {
                continue;
            }

            positions.push({
                column: column,
                line: line,
            });
        }
    }

    // add mines in random positions
    for (let a = 0; a < numberOfMines; a++) {
        // when there's more bomb positions than there are squares in the grid
        if (positions.length === 0) {
            break;
        }

        const random = getRandomInt(0, positions.length - 1);
        const position = positions.splice(random, 1)[0];
        const square = GRID.getSquare(position.column, position.line)!;

        square.setValue(SquareValue.mine);
    }

    // add the numbers to the positions (number of mines in adjacent squares)
    GRID.forEachSquare(function(square) {
        if (square.value !== SquareValue.mine) {
            const minesAround = GRID!.minesAround(square.column, square.line);

            square.setValue(minesAround);
        }
    });
}

/**
 * Clear the previous grid/map, and build a new one.
 */
export function restart() {
    if (GRID) {
        GRID.clear();
        GRID = null;
    }

    buildGrid();
    TIMER.reset();
}

/**
 * Reveal a square (that was clicked). It can be a blank, a mine or a numbered value.
 */
function revealSquare(square: Square) {
    if (!GRID) {
        throw new Error("Grid not available.");
    }

    // the first move of the game
    if (!TIMER.isActive()) {
        // only place the mines/etc after the first move
        // this way we can make sure the first move doesn't hit a mine
        placeMapValues({
            column: square.column,
            line: square.line,
        });
        TIMER.start();
    }

    GRID.revealSquare(square);

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

                // mark the square as a mine, so need to update the number of mines left
                MINES_LEFT--;
                GameMenu.updateMinesLeft(MINES_LEFT);
            } else {
                CURRENT_MOUSE_OVER.setState(SquareState.hidden);

                // removed the 'mine' mark, so need to update the number of mines left
                MINES_LEFT++;
                GameMenu.updateMinesLeft(MINES_LEFT);
            }

            // the .setState() sets the background to hidden, but when we click we have the mouse over, so need to set to that image
            CURRENT_MOUSE_OVER.background.image = getAsset("hidden_mouse_over");
        }
    }
}

function gameOver(victory: boolean) {
    TIMER.stop();
    revealAllMines();

    let title = "";
    let body = "";

    if (victory) {
        const time = TIMER.getElapsedTime();
        const columnSize = Options.getOption("columnSize");
        const lineSize = Options.getOption("lineSize");
        const numberOfMines = Options.getOption("numberOfMines");

        HighScore.add(columnSize, lineSize, numberOfMines, time);

        title = "Victory!";
        body = `Time: ${timeToString(time)}`;
    } else {
        title = "Defeat!";
        body = ":(";
    }

    DIALOG = new Dialog({
        title: title,
        body: body,
        buttonText: "Restart",
        onClose: () => {
            restart();
            DIALOG = undefined;
        },
    });
}
