(function(window)
{
function MineSweeper()
{

}

var GRID = null;

MineSweeper.init = function()
{
var gridSize = 10;
var numberOfMines = 10;

GRID = new Grid( gridSize );

var positions = [];

for (var column = 0 ; column < gridSize ; column++)
    {
    for (var line = 0 ; line < gridSize ; line++)
        {
        positions.push({
                column: column,
                line: line
            });
        }
    }

    // add mines in random positions
for (var a = 0 ; a < numberOfMines ; a++)
    {
    var random = getRandomInt( 0, positions.length - 1 );

    var position = positions.splice( random, 1 )[ 0 ];

    var square = GRID.getSquare( position.column, position.line );

    square.setValue( Square.Value.mine );
    }


    // add the numbers to the positions (number of mines in adjacent squares)
for (var column = 0 ; column < gridSize ; column++)
    {
    for (var line = 0 ; line < gridSize ; line++)
        {
        var square = GRID.getSquare( column, line );

        if ( square.value !== Square.Value.mine )
            {
            var minesAround = GRID.minesAround( column, line );
            
            square.setValue( minesAround );
            }
        }
    }


createjs.Ticker.on( 'tick', MineSweeper.tick );
};






MineSweeper.tick = function()
{
G.STAGE.update();
};


window.MineSweeper = MineSweeper;

}(window));