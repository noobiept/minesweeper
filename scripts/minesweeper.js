(function(window)
{
function MineSweeper()
{

}

var GRID = null;
var COLUMN_SIZE = 10;
var LINE_SIZE = 10;
var NUMBER_OF_MINES = 5;
var TIMER = null;

MineSweeper.init = function()
{
HighScore.load();
MineSweeper.buildMap();
MineSweeper.initMenu();

createjs.Ticker.on( 'tick', MineSweeper.tick );
};


MineSweeper.initMenu = function()
{
    // :: column size :: //
var columnSize = document.querySelector( '#ColumnSize' );
var columnSizeValue = document.querySelector( '#ColumnSizeValue' );

columnSize.value = COLUMN_SIZE;
columnSizeValue.innerHTML = COLUMN_SIZE;
columnSize.onchange = function()
    {
    columnSizeValue.innerHTML = columnSize.value;
    };

    // :: line size :: //
var lineSize = document.querySelector( '#LineSize' );
var lineSizeValue = document.querySelector( '#LineSizeValue' );

lineSize.value = LINE_SIZE;
lineSizeValue.innerHTML = LINE_SIZE;
lineSize.onchange = function()
    {
    lineSizeValue.innerHTML = lineSize.value;
    };


    // :: number of mines :: //
var numberOfMines = document.querySelector( '#NumberOfMines' );
var numberOfMinesValue = document.querySelector( '#NumberOfMinesValue' );

numberOfMines.value = NUMBER_OF_MINES;
numberOfMinesValue.innerHTML = NUMBER_OF_MINES;
numberOfMines.onchange = function()
    {
    numberOfMinesValue.innerHTML = numberOfMines.value;
    };

    // :: restart :: //
var restart = document.querySelector( '#Restart' );

restart.onclick = function()
    {
    COLUMN_SIZE = columnSize.value;
    LINE_SIZE = lineSize.value;
    NUMBER_OF_MINES = numberOfMines.value;

    MineSweeper.restart();
    };

    // :: timer :: //
var timerValue = document.querySelector( '#TimerValue' );

TIMER = new Timer( timerValue );
};


MineSweeper.buildMap = function()
{
GRID = new Grid( COLUMN_SIZE, LINE_SIZE );

var positions = [];

for (var column = 0 ; column < COLUMN_SIZE ; column++)
    {
    for (var line = 0 ; line < LINE_SIZE ; line++)
        {
        positions.push({
                column: column,
                line: line
            });
        }
    }

    // add mines in random positions
for (var a = 0 ; a < NUMBER_OF_MINES ; a++)
    {
        // when there's more bomb positions than there are squares in the grid
    if ( positions.length === 0 )
        {
        break;
        }

    var random = getRandomInt( 0, positions.length - 1 );

    var position = positions.splice( random, 1 )[ 0 ];

    var square = GRID.getSquare( position.column, position.line );

    square.setValue( Square.Value.mine );
    }


    // add the numbers to the positions (number of mines in adjacent squares)
GRID.forEachSquare( function( square )
    {
    if ( square.value !== Square.Value.mine )
        {
        var minesAround = GRID.minesAround( square.column, square.line );

        square.setValue( minesAround );
        }
    });


    // show the high-score for this combination of columns/lines/number of mines
var scores = HighScore.get( COLUMN_SIZE, LINE_SIZE, NUMBER_OF_MINES );
var scoreContainer = document.querySelector( '#HighScoreContainer' );

scoreContainer.innerHTML = '';

if ( scores === null )
    {
    scoreContainer.innerHTML = 'No scores yet.';
    }

else
    {
    for (var a = 0 ; a < scores.length ; a++)
        {
        var scoreElement = document.createElement( 'span' );

        scoreElement.innerHTML = timeToString( scores[ a ] );

        scoreContainer.appendChild( scoreElement );
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
TIMER.reset();
};


MineSweeper.revealSquare = function( square )
{
GRID.revealSquare( square );

if ( !TIMER.isActive() )
    {
    TIMER.start();
    }

if ( square.value == Square.Value.mine )
    {
    MineSweeper.revealAllMines();
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

            if ( adjacent.state !== Square.State.revealed )
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
    TIMER.stop();
    MineSweeper.revealAllMines();
    G.STAGE.update();

    HighScore.add( COLUMN_SIZE, LINE_SIZE, NUMBER_OF_MINES, TIMER.getElapsedTime() );
    window.alert( 'You Win!' );

    MineSweeper.restart();
    }
};


MineSweeper.revealAllMines = function()
{
GRID.forEachSquare( function( square )
    {
    if ( square.value === Square.Value.mine )
        {
        GRID.revealSquare( square );
        }
    });
};


MineSweeper.tick = function()
{
G.STAGE.update();
};


window.MineSweeper = MineSweeper;

}(window));
