(function(window)
{
function Timer( htmlElement )
{
this.interval_time = 100;
this.is_active = false;
this.count_time = 0;
this.interval_f = null;
this.html_element = htmlElement;

htmlElement.innerHTML = timeToString( this.count_time );
}

Timer.prototype.start = function()
{
if ( this.is_active === true )
    {
    return;
    }

var _this = this;

this.is_active = true;

this.interval_f = window.setInterval( function()
    {
    _this.count_time += _this.interval_time;

    _this.html_element.innerHTML = timeToString( _this.count_time );

    }, this.interval_time );
};

Timer.prototype.stop = function()
{
if ( this.is_active === false )
    {
    return;
    }

window.clearInterval( this.interval_f );
this.interval_f = null;
this.is_active = false;
};

Timer.prototype.reset = function()
{
this.stop();
this.count_time = 0;
this.html_element.innerHTML = timeToString( this.count_time );
};


Timer.prototype.isActive = function()
{
return this.is_active;
};

Timer.prototype.getElapsedTime = function()
{
return this.count_time;
};


window.Timer = Timer;

}(window));