var G = {
    PRELOAD: null,
    STAGE: null,
    CANVAS: null,
    GRID: null
};


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );
G.PRELOAD = new createjs.LoadQueue();

    // disable the context menu (when right-clicking)
G.CANVAS.oncontextmenu = function( event ) { return false; };

var manifest = [
        { id: '1', src: 'images/one.png' },
        { id: '2', src: 'images/two.png' },
        { id: '3', src: 'images/three.png' },
        { id: '4', src: 'images/four.png' },
        { id: '5', src: 'images/five.png' },
        { id: '6', src: 'images/six.png' },
        { id: '7', src: 'images/seven.png' },
        { id: '8', src: 'images/eight.png' },
        { id: 'blank', src: 'images/blank.png' },
        { id: 'mine', src: 'images/mine.png' },
        { id: 'hidden', src: 'images/hidden.png' },
        { id: 'hidden_mouse_over', src: 'images/hidden_mouse_over.png' },
        { id: 'question_mark', src: 'images/question_mark.png' },
        { id: 'mine_flag', src: 'images/mine_flag.png' }
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

