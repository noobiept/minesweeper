/*global AppStorage*/

var HighScore;
(function (HighScore) {


var HIGH_SCORE = {};
var MAX_SCORES_SAVED = 5;


function save()
{
AppStorage.setData({ 'minesweeper_high_score': HIGH_SCORE });
}


HighScore.load = function( data )
{
if ( data )
    {
    var score = data[ 'minesweeper_high_score' ];

    if ( score )
        {
        HIGH_SCORE = score;
        }
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
    return a - b;
    });

    // if we pass the limit, remove one of the lesser scores
if ( HIGH_SCORE[ name ].length > MAX_SCORES_SAVED )
    {
    HIGH_SCORE[ name ].pop();
    }

save();
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


})(HighScore || (HighScore = {}));