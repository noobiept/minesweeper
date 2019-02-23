import * as AppStorage from './app_storage.js';
import * as HighScore from './high_score.js';
import * as MineSweeper from './minesweeper.js';
import Grid from './grid.js';


interface Global {
    PRELOAD: createjs.LoadQueue;
    STAGE: createjs.Stage;
    CANVAS: HTMLCanvasElement;
    GRID: Grid;
}


export var G: Global = {
    PRELOAD: null,
    STAGE: null,
    CANVAS: null,
    GRID: null
};


window.onload = function()
{
AppStorage.getData( [ 'minesweeper_high_score' ], initApp );
};


function initApp( data: AppStorage.StorageData )
{
G.CANVAS = document.getElementById( 'MainCanvas' ) as HTMLCanvasElement;
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

HighScore.load( data );
var loadMessage = document.getElementById( 'LoadMessage' )!;

var left = $( window ).width()! / 2;
var top = $( window ).height()! / 2;

$( loadMessage ).css( 'top', top + 'px' );
$( loadMessage ).css( 'left', left + 'px' );

G.PRELOAD.addEventListener( 'progress', function( event: createjs.ProgressEvent )
    {
    $( loadMessage ).text( (event.progress * 100 | 0) + '%' );
    } as (event: Object) => void);
G.PRELOAD.addEventListener( 'complete', function()
    {
    $( loadMessage ).css( 'display', 'none' );

    MineSweeper.init();
    });
G.PRELOAD.loadManifest( manifest, true );
}
