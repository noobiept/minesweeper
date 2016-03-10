/*global Square, G*/

(function(window)
{
function Grid( columnSize, lineSize )
{
var grid = [];
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


Grid.prototype.revealSquare = function( square )
{
var index = this.hidden_squares.indexOf( square );

this.hidden_squares.splice( index, 1 );

square.setState( Square.State.revealed );
};


Grid.prototype.getSquare = function( column, line )
{
if ( column < 0 || column >= this.column_size ||
     line   < 0 || line   >= this.line_size )
    {
    return null;
    }

return this.grid[ column ][ line ];
};


Grid.prototype.getAdjacentSquares = function( column, line )
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
};


/*
    How many mines there are in adjacent squares (not counting the position given, just the ones around it)
 */

Grid.prototype.minesAround = function( column, line )
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
};


Grid.prototype.forEachSquare = function( callback )
{
for (var column = 0 ; column < this.column_size ; column++)
    {
    for (var line = 0 ; line < this.line_size ; line++)
        {
        var square = this.grid[ column ][ line ];

        callback( square );
        }
    }
};


Grid.prototype.clear = function()
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
};


window.Grid = Grid;

}(window));
