import { G, getAsset } from './main.js';


export enum SquareState {
    hidden,          // still hasn't been shown
    revealed,        // by clicking on the square, we find out its value
    question_mark,   // we think its a mine in that position, just a visual help
    mine_flag        // marks the square as containing a mine, again just to help
}

// the string values match the images ids that get pre-loaded at the start of the application
export enum SquareValue {
    mine = 'mine', blank = 'blank',
    one = '1', two = '2', three = '3', four = '4',
    five = '5', six = '6', seven = '7', eight = '8'
}


export default class Square
{
static size = 30;   // size of each individual square (30x30 pixels)

value: SquareValue;
column: number;
line: number;
state: SquareState;
is_selected: boolean;
container: createjs.Container;
background: createjs.Bitmap;
front: createjs.Bitmap;

constructor( column: number, line: number ) {

    this.value = SquareValue.blank;
    this.column = column;
    this.line = line;
    this.state = SquareState.hidden;
    this.is_selected = false;

    var container = new createjs.Container();

    var background = new createjs.Bitmap( getAsset( 'hidden' ) );
    var front = new createjs.Bitmap( getAsset( 'question_mark' ) ); // need to initialize with an image, but its not visible initially
    front.visible = false;

    container.addChild( background );
    container.addChild( front );

    container.x = column * Square.size;
    container.y = line * Square.size;

    G.STAGE.addChild( container );

    this.container = container;
    this.background = background;
    this.front = front;
}


setState( state: SquareState )
{
if ( state === this.state )
    {
    return;
    }

this.state = state;

if ( state === SquareState.hidden )
    {
    this.background.image = getAsset( 'hidden' );
    this.front.visible = false;
    }

else if ( state === SquareState.revealed )
    {
    this.background.image = getAsset( this.value );
    this.front.visible = false;
    }

else if ( state === SquareState.question_mark )
    {
    this.background.image = getAsset( 'hidden' );
    this.front.image = getAsset( 'question_mark' );
    this.front.visible = true;
    }

else if ( state === SquareState.mine_flag )
    {
    this.background.image = getAsset( 'hidden' );
    this.front.image = getAsset( 'mine_flag' );
    this.front.visible = true;
    }

else
    {
    throw new Error( 'Wrong state argument.' );
    }
}


select()
{
if ( !this.is_selected && this.state !== SquareState.revealed )
    {
    this.background.image = getAsset( 'hidden_mouse_over' );
    this.is_selected = true;
    }
}


unSelect()
{
if ( this.is_selected && this.state !== SquareState.revealed )
    {
    this.background.image = getAsset( 'hidden' );
    this.is_selected = false;
    }
}


/**
 * 'numberOfMines': -1 if there's a mine, otherwise its a number between 0 and 8 (and the correspondent square value).
 */
setValue( numberOfMines: number ) {
    switch( numberOfMines) {
        case 0:
            this.value = SquareValue.blank;
            break;

        case 1:
            this.value = SquareValue.one;
            break;

        case 2:
            this.value = SquareValue.two;
            break;

        case 3:
            this.value = SquareValue.three;
            break;

        case 4:
            this.value = SquareValue.four;
            break;

        case 5:
            this.value = SquareValue.five;
            break;

        case 6:
            this.value = SquareValue.six;
            break;

        case 7:
            this.value = SquareValue.seven;
            break;

        case 8:
            this.value = SquareValue.eight;
            break;

        default:
            this.value = SquareValue.mine;
            break;
    }
};


clear()
{
G.STAGE.removeChild( this.container );
}

}