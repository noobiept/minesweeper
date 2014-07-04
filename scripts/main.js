/*
    libraries:

        - createjs
            - easeljs   : 0.7
            - preloadjs : 0.4
        - jquery        : 2.1
        - underscore    : 1.6
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
G.STAGE.enableMouseOver();
G.PRELOAD = new createjs.LoadQueue();

    // disable the context menu (when right-clicking)
G.CANVAS.oncontextmenu = function( event ) { return false; };

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
        { id: 'hidden', src: STATIC_URL + 'images/hidden.png' },
        { id: 'hidden_mouse_over', src: STATIC_URL + 'images/hidden_mouse_over.png' },
        { id: 'question_mark', src: STATIC_URL + 'images/question_mark.png' },
        { id: 'mine_flag', src: STATIC_URL + 'images/mine_flag.png' }
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

