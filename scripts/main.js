/*
    libraries:

        - createjs
            - easeljs   : 0.7
            - preloadjs : 0.4
        - jquery        : 2.1
        - underscore    : 1.6


    - starts with a grid of undifferentiated squares
    - some randomly selected squares, contain mines
    - have the size of the grid, and the number of mines as an option to the user
    - clicking on a square, reveals it, which will show how many mines there are around it (or blank if none)
    - if click on a mine the game ends
    - be able to add a question mark to a square to help
    - have the first square protected (as in, you can't choose a mine on the first selected square)
    - when clicking on a blank square (no mines around it), show all the blank squares adjacent, plus the first numbered square around
    - Commonly, the color code for the numbers is blue for 1, green for 2, red for 3, purple for 4, maroon for 5, cyan for 6, black for 7, and grey for 8.
 */

var G = {
    PRELOAD: null,
    STAGE: null,
    CANVAS: null,
    GRID: null
};

var STATIC_URL = '';

window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );
G.PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: '1', src: STATIC_URL + 'images/one.png' },
        { id: '2', src: STATIC_URL + 'images/two.png' },
        { id: '3', src: STATIC_URL + 'images/three.png' },
        { id: '4', src: STATIC_URL + 'images/four.png' },
        { id: '5', src: STATIC_URL + 'images/five.png' },
        { id: '6', src: STATIC_URL + 'images/six.png' },
        { id: '7', src: STATIC_URL + 'images/seven.png' },
        { id: '8', src: STATIC_URL + 'images/eight.png' },
        { id: 'blank', src: STATIC_URL + 'images/blank.png' },
        { id: 'mine', src: STATIC_URL + 'images/mine.png' },
        { id: 'hidden', src: STATIC_URL + 'images/hidden.png' }
    ];


var loadMessage = document.querySelector( '#LoadMessage' );

var left = $( window ).width() / 2;
var top = $( window ).height() / 2;

$( loadMessage ).css( 'top', top + 'px' );
$( loadMessage ).css( 'left', left + 'px' );

G.PRELOAD.addEventListener( 'progress', function( event )
    {
    $( loadMessage ).text( (event.progress * 100 | 0) + '%' );
    });
G.PRELOAD.addEventListener( 'complete', function()
    {
    $( loadMessage ).css( 'display', 'none' );

    MineSweeper.init();
    });
G.PRELOAD.loadManifest( manifest, true );
};

