(function(window)
{
function Grid( size )
{
var grid = [];

for (var column = 0 ; column < size ; column++)
    {
    grid[ column ] = [];

    for (var line = 0 ; line < size ; line++)
        {
        grid[ column ][ line ] = new Square( column, line );
        }
    }

var sizePixels = size * Square.size;

G.CANVAS.width = sizePixels;
G.CANVAS.height = sizePixels;

this.size = size;
this.grid = grid;
}


Grid.prototype.getSquare = function( column, line )
{
return this.grid[ column ][ line ];
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


window.Grid = Grid;

}(window));
