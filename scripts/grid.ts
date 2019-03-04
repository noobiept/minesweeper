import Square, { SquareState, SquareValue } from "./square.js";
import { setCanvasDimensions } from "./main.js";

export interface GridPosition {
    column: number;
    line: number;
}

export interface GridArgs {
    columnSize: number;
    lineSize: number;
    onStateChange: (previous: SquareState, next: SquareState) => void;
}

export default class Grid {
    column_size: number;
    line_size: number;
    grid: Square[][];
    hidden_squares: Square[];

    constructor(args: GridArgs) {
        const columnSize = args.columnSize;
        const lineSize = args.lineSize;
        const grid: Square[][] = [];
        const hidden_squares = [];

        for (let column = 0; column < columnSize; column++) {
            grid[column] = [];

            for (let line = 0; line < lineSize; line++) {
                const square = new Square({
                    column: column,
                    line: line,
                    onStateChange: args.onStateChange,
                });

                grid[column][line] = square;
                hidden_squares.push(square);
            }
        }

        setCanvasDimensions(Square.size * columnSize, Square.size * lineSize);

        this.column_size = columnSize;
        this.line_size = lineSize;
        this.grid = grid;
        this.hidden_squares = hidden_squares;
    }

    revealSquare(square: Square) {
        var index = this.hidden_squares.indexOf(square);

        this.hidden_squares.splice(index, 1);

        square.setState(SquareState.revealed);
    }

    getSquare(column: number, line: number) {
        if (
            column < 0 ||
            column >= this.column_size ||
            line < 0 ||
            line >= this.line_size
        ) {
            return null;
        }

        return this.grid[column][line];
    }

    getAdjacentSquares(column: number, line: number) {
        var adjacents = [];

        for (var xOffset = -1; xOffset <= 1; xOffset++) {
            for (var yOffset = -1; yOffset <= 1; yOffset++) {
                var adjacentColumn = xOffset + column;
                var adjacentLine = yOffset + line;

                // don't consider the center position
                if (adjacentColumn == column && adjacentLine == line) {
                    continue;
                }

                // check the grids limits
                if (
                    adjacentColumn >= 0 &&
                    adjacentColumn < this.column_size &&
                    adjacentLine >= 0 &&
                    adjacentLine < this.line_size
                ) {
                    var square = this.grid[adjacentColumn][adjacentLine];

                    adjacents.push(square);
                }
            }
        }

        return adjacents;
    }

    /*
    How many mines there are in adjacent squares (not counting the position given, just the ones around it)
 */
    minesAround(column: number, line: number) {
        var count = 0;

        for (var xOffset = -1; xOffset <= 1; xOffset++) {
            for (var yOffset = -1; yOffset <= 1; yOffset++) {
                var adjacentColumn = xOffset + column;
                var adjacentLine = yOffset + line;

                // don't consider the center position
                if (adjacentColumn == column && adjacentLine == line) {
                    continue;
                }

                // check the grids limits
                if (
                    adjacentColumn >= 0 &&
                    adjacentColumn < this.column_size &&
                    adjacentLine >= 0 &&
                    adjacentLine < this.line_size
                ) {
                    var square = this.grid[adjacentColumn][adjacentLine];

                    if (square.value === SquareValue.mine) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    forEachSquare(callback: (square: Square) => void) {
        for (var column = 0; column < this.column_size; column++) {
            for (var line = 0; line < this.line_size; line++) {
                var square = this.grid[column][line];

                callback(square);
            }
        }
    }

    clear() {
        for (var column = 0; column < this.column_size; column++) {
            for (var line = 0; line < this.line_size; line++) {
                var square = this.grid[column][line];

                square.clear();
            }
        }

        this.grid.length = 0;
        this.hidden_squares.length = 0;
    }
}
