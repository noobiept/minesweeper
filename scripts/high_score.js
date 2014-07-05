(function(window)
{
function HighScore()
{

}

var HIGH_SCORE = {};
var MAX_SCORES_SAVED = 5;


HighScore.save = function()
{
saveObject( 'high_score', HIGH_SCORE );
};


HighScore.load = function()
{
var score = getObject( 'high_score' );

if ( score !== null )
    {
    HIGH_SCORE = score;
    }
};


HighScore.add = function( columns, lines, mines, time )
{
var name = columns + '_' + lines + '_' + mines;

if ( typeof HIGH_SCORE[ name ] == 'undefined' )
    {
    HIGH_SCORE[ name ] = [];
    }

HIGH_SCORE[ name ].push( time );

    // have the better scores first (better means a lesser value (finished the map faster))
HIGH_SCORE[ name ].sort( function( a, b )
    {
    return b - a;
    });

    // if we pass the limit, remove one of the lesser scores
if ( HIGH_SCORE[ name ].length > MAX_SCORES_SAVED )
    {
    HIGH_SCORE[ name ].pop();
    }

HighScore.save();
};


HighScore.getAll = function()
{
return HIGH_SCORE;
};


HighScore.get = function( columns, lines, mines )
{
var key = columns + '_' + lines + '_' + mines;

if ( typeof HIGH_SCORE[ key ] == 'undefined' )
    {
    return null;
    }

return HIGH_SCORE[ key ];
};


HighScore.removeAll = function()
{
HIGH_SCORE.length = 0;

localStorage.removeItem( 'high_score' );
};


/*
    Save an object to localStorage (converts to a json string)
 */

function saveObject( key, value )
{
localStorage.setItem( key, JSON.stringify( value ) );
}


/*
    Returns an object (converted from json text) loaded from localStorage
 */

function getObject( key )
{
var value = localStorage.getItem( key );

return value && JSON.parse( value );
}


window.HighScore = HighScore;

}(window));