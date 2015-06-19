(function(window)
{
function Square( column, line )
{
var _this = this;

this.value = Square.Value.blank;
this.column = column;
this.line = line;
this.state = Square.State.hidden;
this.is_selected = false;

var container = new createjs.Container();

var background = new createjs.Bitmap( G.PRELOAD.getResult( 'hidden' ) );
var front = new createjs.Bitmap();

container.addChild( background );
container.addChild( front );

container.x = column * Square.size;
container.y = line * Square.size;

G.STAGE.addChild( container );

this.container = container;
this.background = background;
this.front = front;
}

Square.size = 30;   // size of each individual square (30x30 pixels)
Square.Value = {
        mine: 'mine',
        blank: 'blank',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8'
    };
Square.State = {
        hidden: 0,          // still hasn't been shown
        revealed: 1,        // by clicking on the square, we find out its value
        question_mark: 2,   // we think its a mine in that position, just a visual help
        mine_flag: 3        // marks the square as containing a mine, again just to help
    };


Square.prototype.setState = function( state )
{
if ( state === this.state )
    {
    return;
    }

this.state = state;

if ( state === Square.State.hidden )
    {
    this.background.image = G.PRELOAD.getResult( 'hidden' );
    this.front.image = '';
    }

else if ( state === Square.State.revealed )
    {
    this.background.image = G.PRELOAD.getResult( this.value );
    this.front.image = '';
    }

else if ( state === Square.State.question_mark )
    {
    this.background.image = G.PRELOAD.getResult( 'hidden' );
    this.front.image = G.PRELOAD.getResult( 'question_mark' );
    }

else if ( state === Square.State.mine_flag )
    {
    this.background.image = G.PRELOAD.getResult( 'hidden' );
    this.front.image = G.PRELOAD.getResult( 'mine_flag' );
    }

else
    {
    console.log( 'error, wrong state argument.' );
    }
};


Square.prototype.select = function()
{
if ( !this.is_selected && this.state !== Square.State.revealed )
    {
    this.background.image = G.PRELOAD.getResult( 'hidden_mouse_over' );
    this.is_selected = true;
    }
};


Square.prototype.unSelect = function()
{
if ( this.is_selected && this.state !== Square.State.revealed )
    {
    this.background.image = G.PRELOAD.getResult( 'hidden' );
    this.is_selected = false;
    }
};



Square.prototype.setValue = function( value )
{
if ( value < 0 )
    {
    this.value = Square.Value.mine;
    }

else if ( value === 0 )
    {
    this.value = Square.Value.blank;
    }

else
    {
    this.value = Square.Value[ value ];
    }
};


Square.prototype.clear = function()
{
G.STAGE.removeChild( this.container );
};


window.Square = Square;

}(window));
