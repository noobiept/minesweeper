(function(window)
{
function Grid( size, numberOfMines )
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

this.grid = grid;
}


window.Grid = Grid;

}(window));
