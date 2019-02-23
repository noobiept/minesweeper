import Square from './square.js';
import { G } from './main.js';


export default class Grid
{
column_size: number;
line_size: number;
grid: Square[][];
hidden_squares: Square[];

constructor(columnSize: number, lineSize: number) {

var grid: Square[][] = [];
var hidden_squares = [];

for (var column = 0 ; column < columnSize ; column++)
    {
    grid[ column ] = [];

    for (var line = 0 ; line < lineSize ; line++)
        {
        var square = new Square( column, line );

        grid[ column ][ line ] = square;
        hidden_squares.push( square );
        }
    }

G.CANVAS.width = Square.size * columnSize;
G.CANVAS.height = Square.size * lineSize;

this.column_size = columnSize;
this.line_size = lineSize;
this.grid = grid;
this.hidden_squares = hidden_squares;
}


revealSquare( square: Square )
{
var index = this.hidden_squares.indexOf( square );

this.hidden_squares.splice( index, 1 );

square.setState( Square.State.revealed );
}


getSquare( column: number, line: number )
{
if ( column < 0 || column >= this.column_size ||
     line   < 0 || line   >= this.line_size )
    {
    return null;
    }

return this.grid[ column ][ line ];
}


getAdjacentSquares( column: number, line: number )
{
var adjacents = [];

for (var xOffset = -1 ; xOffset <= 1 ; xOffset++)
    {
    for (var yOffset = -1 ; yOffset <= 1 ; yOffset++)
        {
        var adjacentColumn = xOffset + column;
        var adjacentLine = yOffset + line;

            // don't consider the center position
        if ( adjacentColumn == column && adjacentLine == line )
            {
            continue;
            }

            // check the grids limits
        if ( adjacentColumn >= 0 && adjacentColumn < this.column_size &&
             adjacentLine   >= 0 && adjacentLine   < this.line_size )
            {
            var square = this.grid[ adjacentColumn ][ adjacentLine ];

            adjacents.push( square );
            }
        }
    }


return adjacents;
}


/*
    How many mines there are in adjacent squares (not counting the position given, just the ones around it)
 */
minesAround( column: number, line: number )
{
var count = 0;

for (var xOffset = -1 ; xOffset <= 1 ; xOffset++)
    {
    for (var yOffset = -1 ; yOffset <= 1 ; yOffset++)
        {
        var adjacentColumn = xOffset + column;
        var adjacentLine = yOffset + line;

            // don't consider the center position
        if ( adjacentColumn == column && adjacentLine == line )
            {
            continue;
            }

            // check the grids limits
        if ( adjacentColumn >= 0 && adjacentColumn < this.column_size &&
             adjacentLine   >= 0 && adjacentLine   < this.line_size )
            {
            var square = this.grid[ adjacentColumn ][ adjacentLine ];

            if ( square.value === Square.Value.mine )
                {
                count++;
                }
            }
        }
    }

return count;
}


forEachSquare( callback: (square: Square) => void )
{
for (var column = 0 ; column < this.column_size ; column++)
    {
    for (var line = 0 ; line < this.line_size ; line++)
        {
        var square = this.grid[ column ][ line ];

        callback( square );
        }
    }
}


clear()
{
for (var column = 0 ; column < this.column_size ; column++)
    {
    for (var line = 0 ; line < this.line_size ; line++)
        {
        var square = this.grid[ column ][ line ];

        square.clear();
        }
    }

this.grid.length = 0;
this.hidden_squares.length = 0;
}
}
