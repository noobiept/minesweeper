
export default class Timer {

interval_time: number;
is_active: boolean;
count_time: number;
interval_f: number | null;
html_element: HTMLElement;

constructor( htmlElement: HTMLElement )
{
this.interval_time = 100;
this.is_active = false;
this.count_time = 0;
this.interval_f = null;
this.html_element = htmlElement;

htmlElement.innerHTML = timeToString( this.count_time );
}

start()
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
}


stop()
{
if ( this.is_active === false )
    {
    return;
    }

window.clearInterval( this.interval_f );
this.interval_f = null;
this.is_active = false;
}


reset()
{
this.stop();
this.count_time = 0;
this.html_element.innerHTML = timeToString( this.count_time );
}


isActive()
{
return this.is_active;
}

getElapsedTime()
{
return this.count_time;
}
}