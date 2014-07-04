(function(window)
{
function MineSweeper()
{

}

var GRID = null;

MineSweeper.init = function()
{
MineSweeper.buildMap();

createjs.Ticker.on( 'tick', MineSweeper.tick );
};


MineSweeper.buildMap = function()
{
var gridSize = 10;
var numberOfMines = 5;

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
};


MineSweeper.restart = function()
{
if ( GRID )
    {
    GRID.clear();
    GRID = null;
    }

MineSweeper.buildMap();
};


MineSweeper.revealSquare = function( square )
{
GRID.revealSquare( square );

if ( square.value == Square.Value.mine )
    {
    G.STAGE.update();
    window.alert( 'Defeat!' );   //HERE
    MineSweeper.restart();
    return;
    }


    // need to reveal all the blank values around it
if ( square.value == Square.Value.blank )
    {
    var applyToAdjacents = function( aSquare )
        {
        var adjacents = GRID.getAdjacentSquares( aSquare.column, aSquare.line );

        for (var a = 0 ; a < adjacents.length ; a++)
            {
            var adjacent = adjacents[ a ];

            if ( adjacent.is_hidden )
                {
                GRID.revealSquare( adjacent );

                if ( adjacent.value === Square.Value.blank )
                    {
                    applyToAdjacents( adjacent );
                    }
                }
            }
        };

    applyToAdjacents( square );
    }

    // check if the game is won (when the un-revealed squares are all mines)
var finishLoop = true;

for (var a = 0 ; a < GRID.hidden_squares.length ; a++)
    {
    if ( GRID.hidden_squares[ a ].value !== Square.Value.mine )
        {
        finishLoop = false;
        break;
        }
    }

if ( finishLoop )
    {
    G.STAGE.update();
    window.alert( 'You Win!' );
    MineSweeper.restart();
    }
};



MineSweeper.tick = function()
{
G.STAGE.update();
};


window.MineSweeper = MineSweeper;

}(window));
