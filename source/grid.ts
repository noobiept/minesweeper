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
    private column_size: number;
    private line_size: number;
    private grid: Square[][];
    private hidden_squares: Square[];

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

    /**
     * Reveal a square (shows its actual value).
     */
    revealSquare(square: Square) {
        const index = this.hidden_squares.indexOf(square);
        this.hidden_squares.splice(index, 1);

        square.setState(SquareState.revealed);
    }

    /**
     * Get the square in the given position.
     */
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

    /**
     * Get the squares around the given position.
     */
    getAdjacentSquares(column: number, line: number) {
        const adjacents = [];

        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                const adjacentColumn = xOffset + column;
                const adjacentLine = yOffset + line;

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
                    const square = this.grid[adjacentColumn][adjacentLine];

                    adjacents.push(square);
                }
            }
        }

        return adjacents;
    }

    /**
     * Returns the number of mines there are in adjacent squares (not counting the position given, just the ones around it).
     */
    minesAround(column: number, line: number) {
        let count = 0;

        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                const adjacentColumn = xOffset + column;
                const adjacentLine = yOffset + line;

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
                    const square = this.grid[adjacentColumn][adjacentLine];

                    if (square.getValue() === SquareValue.mine) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    /**
     * Reveal recursively all the blank squares around the given square until we find a numbered square.
     */
    revealSquaresAround(square: Square) {
        const adjacents = this.getAdjacentSquares(square.column, square.line);

        for (let a = 0; a < adjacents.length; a++) {
            const adjacent = adjacents[a];

            if (adjacent.getState() !== SquareState.revealed) {
                this.revealSquare(adjacent);

                if (adjacent.getValue() === SquareValue.blank) {
                    this.revealSquaresAround(adjacent);
                }
            }
        }
    }

    /**
     * Loop through all the squares in the grid.
     */
    forEachSquare(callback: (square: Square) => void) {
        for (let column = 0; column < this.column_size; column++) {
            for (let line = 0; line < this.line_size; line++) {
                const square = this.grid[column][line];

                callback(square);
            }
        }
    }

    /**
     * Check if all the hidden squares are mines (the game winning condition).
     */
    areAllHiddenSquaresMines() {
        for (let a = 0; a < this.hidden_squares.length; a++) {
            if (this.hidden_squares[a].getValue() !== SquareValue.mine) {
                return false;
            }
        }

        return true;
    }

    /**
     * Clear the grid and its squares.
     */
    clear() {
        for (let column = 0; column < this.column_size; column++) {
            for (let line = 0; line < this.line_size; line++) {
                const square = this.grid[column][line];

                square.clear();
            }
        }

        this.grid.length = 0;
        this.hidden_squares.length = 0;
    }
}
