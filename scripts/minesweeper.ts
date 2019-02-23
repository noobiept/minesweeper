/*global HighScore, G, createjs, Timer, Grid, Square, getRandomInt, timeToString*/

(function(window)
{
function MineSweeper()
{

}

var GRID = null;
var COLUMN_SIZE = 9;
var LINE_SIZE = 9;
var NUMBER_OF_MINES = 10;
var TIMER = null;

var CURRENT_MOUSE_OVER = null;     // the current square element that is being highlighted


MineSweeper.init = function()
{
HighScore.load();
MineSweeper.buildMap();
MineSweeper.initMenu();

G.CANVAS.addEventListener( 'mousemove', MineSweeper.mouseMove );
G.CANVAS.addEventListener( 'mousedown', MineSweeper.mouseClick );
createjs.Ticker.on( 'tick', MineSweeper.tick );
};


MineSweeper.initMenu = function()
{
    // :: column size :: //
var columnSize = document.querySelector( '#ColumnSize' );
var columnSizeValue = document.querySelector( '#ColumnSizeValue' );

columnSize.value = COLUMN_SIZE;
columnSizeValue.innerHTML = COLUMN_SIZE;
$( columnSize ).on( 'input change', function()
    {
    columnSizeValue.innerHTML = columnSize.value;
    });

    // :: line size :: //
var lineSize = document.querySelector( '#LineSize' );
var lineSizeValue = document.querySelector( '#LineSizeValue' );

lineSize.value = LINE_SIZE;
lineSizeValue.innerHTML = LINE_SIZE;
$( lineSize ).on( 'input change', function()
    {
    lineSizeValue.innerHTML = lineSize.value;
    });


    // :: number of mines :: //
var numberOfMines = document.querySelector( '#NumberOfMines' );
var numberOfMinesValue = document.querySelector( '#NumberOfMinesValue' );

numberOfMines.value = NUMBER_OF_MINES;
numberOfMinesValue.innerHTML = NUMBER_OF_MINES;
$( numberOfMines ).on( 'input change', function()
    {
    numberOfMinesValue.innerHTML = numberOfMines.value;
    });

    // :: restart :: //
var restart = document.querySelector( '#Restart' );

$( restart ).on( 'click', function()
    {
    COLUMN_SIZE = columnSize.value;
    LINE_SIZE = lineSize.value;
    NUMBER_OF_MINES = numberOfMines.value;

    MineSweeper.restart();
    });

    // :: timer :: //
var timerValue = document.querySelector( '#TimerValue' );

TIMER = new Timer( timerValue );

    // show the menu/high-score
$( '#Menu' ).css( 'display', 'block' );
$( '#HighScore' ).css( 'display', 'block' );

    // :: donate :: //
$( '#DonateButton' ).removeClass( 'hidden' ).button();
};


MineSweeper.buildMap = function()
{
GRID = new Grid( COLUMN_SIZE, LINE_SIZE );

var positions = [];
var a;

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
for (a = 0 ; a < NUMBER_OF_MINES ; a++)
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
    for (a = 0 ; a < scores.length ; a++)
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
    gameOver( false );
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
    gameOver( true );
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


/**
 * Update the selected square on mouse move.
 */
MineSweeper.mouseMove = function( event )
{
var canvasRect = G.CANVAS.getBoundingClientRect();

var x = event.clientX - canvasRect.left;
var y = event.clientY - canvasRect.top;

var column = Math.floor( x / Square.size );
var line = Math.floor( y / Square.size );

var square = GRID.getSquare( column, line );

if ( square )
    {
    if ( CURRENT_MOUSE_OVER && square !== CURRENT_MOUSE_OVER )
        {
        CURRENT_MOUSE_OVER.unSelect();
        }

    CURRENT_MOUSE_OVER = square;
    square.select();
    }

else
    {
    if ( CURRENT_MOUSE_OVER )
        {
        CURRENT_MOUSE_OVER.unSelect();
        CURRENT_MOUSE_OVER = null;
        }
    }
};


/**
 * Reveal the current selected square on mouse left click.
 * Flag the square on right click (question mark/mine flag/hidden).
 */
MineSweeper.mouseClick = function( event )
{
if ( CURRENT_MOUSE_OVER )
    {
    var button = event.button;

    if ( CURRENT_MOUSE_OVER.state == Square.State.revealed )
        {
        return;
        }

        // left click
    if ( button == 0 )
        {
        if ( CURRENT_MOUSE_OVER.state == Square.State.mine_flag )
            {
            return;
            }

        MineSweeper.revealSquare( CURRENT_MOUSE_OVER )
        }

        // right click
    else if ( button == 2 )
        {
        if ( CURRENT_MOUSE_OVER.state === Square.State.hidden )
            {
            CURRENT_MOUSE_OVER.setState( Square.State.question_mark );
            }

        else if ( CURRENT_MOUSE_OVER.state === Square.State.question_mark )
            {
            CURRENT_MOUSE_OVER.setState( Square.State.mine_flag );
            }

        else
            {
            CURRENT_MOUSE_OVER.setState( Square.State.hidden );
            }

            // the .setState() sets the background to hidden, but when we click we have the mouse over, so need to set to that image
        CURRENT_MOUSE_OVER.background.image = G.PRELOAD.getResult( 'hidden_mouse_over' );
        }
    }
};


function gameOver( victory )
{
TIMER.stop();
MineSweeper.revealAllMines();
G.STAGE.update();

if ( victory )
    {
    var time = TIMER.getElapsedTime();
    HighScore.add( COLUMN_SIZE, LINE_SIZE, NUMBER_OF_MINES, time );

    $( '#DialogMessage' ).text( 'You Win! ' + timeToString( time ) ).dialog({
            modal: true,
            close: function( event, ui ) {
                MineSweeper.restart();
            },
            buttons: {
                ok: function() {
                    $( this ).dialog( 'close' );
                }
            }
        });
    }

else
    {
    $( '#DialogMessage' ).text( 'Defeat!' ).dialog({
            modal: true,
            close: function( event, ui ) {
                MineSweeper.restart();
            },
            buttons: {
                ok: function() {
                    $( this ).dialog( 'close' );
                }
            }
        });
    }
}


MineSweeper.tick = function()
{
G.STAGE.update();
};


window.MineSweeper = MineSweeper;
}(window));
