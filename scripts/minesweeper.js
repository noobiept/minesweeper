(function(window)
{
function MineSweeper()
{

}

var GRID = null;

MineSweeper.init = function()
{
var gridSize = 10;
var numberOfMines = 10;

GRID = new Grid( gridSize, numberOfMines );

createjs.Ticker.on( 'tick', MineSweeper.tick );
};






MineSweeper.tick = function()
{
G.STAGE.update();
};


window.MineSweeper = MineSweeper;

}(window));