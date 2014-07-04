(function(window)
{
function Grid( size )
{
var grid = [];
var hidden_squares = [];

for (var column = 0 ; column < size ; column++)
    {
    grid[ column ] = [];

    for (var line = 0 ; line < size ; line++)
        {
        var square = new Square( column, line );

        grid[ column ][ line ] = square;
        hidden_squares.push( square );
        }
    }

var sizePixels = size * Square.size;

G.CANVAS.width = sizePixels;
G.CANVAS.height = sizePixels;

this.size = size;
this.grid = grid;
this.hidden_squares = hidden_squares;
}


Grid.prototype.revealSquare = function( square )
{
var index = this.hidden_squares.indexOf( square );

this.hidden_squares.splice( index, 1 );

square.reveal();
};


Grid.prototype.getSquare = function( column, line )
{
if ( column < 0 || column >= this.size ||
     line   < 0 || line   >= this.size )
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
        if ( adjacentColumn >= 0 && adjacentColumn < this.size &&
             adjacentLine   >= 0 && adjacentLine   < this.size )
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
        if ( adjacentColumn >= 0 && adjacentColumn < this.size &&
             adjacentLine   >= 0 && adjacentLine   < this.size )
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
var size = this.size;

for (var column = 0 ; column < size ; column++)
    {
    for (var line = 0 ; line < size ; line++)
        {
        var square = this.grid[ column ][ line ];

        callback( square );
        }
    }
};


Grid.prototype.clear = function()
{
var size = this.size;

for (var column = 0 ; column < size ; column++)
    {
    for (var line = 0 ; line < size ; line++)
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
