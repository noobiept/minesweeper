(function(window)
{
/*
    Each square has a value

        -1 : is a mine
         0 : its blank (no mines in adjacent squares)
         1 : means there's 1 mine in adjacent squares
         2 : means there's 2 mines in adjacent squares
         etc..
         8 : all the squares around it have mines
 */

function Square( column, line )
{
this.value = Square.Value.blank;
this.column = column;
this.line = line;
this.is_hidden = true;

var shape = new createjs.Bitmap( G.PRELOAD.getResult( 'hidden' ) );

shape.x = column * Square.size;
shape.y = line * Square.size;
shape.on( 'click', this.reveal, this );

G.STAGE.addChild( shape );

this.shape = shape;
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

Square.prototype.reveal = function()
{
if ( !this.is_hidden )
    {
    return;
    }

this.is_hidden = false;
this.shape.image = G.PRELOAD.getResult( this.value );
};



Square.prototype.setValue = function( value )
{
this.value = Square.Value[ value ];
};



window.Square = Square;

}(window));