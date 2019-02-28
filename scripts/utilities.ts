export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Rounds a number to a specified decimal case.
 */
export function round(num: number, dec: number) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

/**
 * Converts a time (in milliseconds) to a string (with the number of days/hours...).
 */
export function timeToString(dateMilliseconds: number) {
    // :: convert to days/hours :: //

    //in milliseconds
    var second = 1000;
    var minute = 60 * second;
    var hour = 60 * minute;
    var day = 24 * hour;

    var minutesLeft = 0;
    var hoursLeft = 0;
    var daysLeft = 0;
    var secondsLeft = 0;

    //count the days
    while (dateMilliseconds > day) {
        daysLeft++;

        dateMilliseconds -= day;
    }

    //count the hours
    while (dateMilliseconds > hour) {
        hoursLeft++;

        dateMilliseconds -= hour;
    }

    //count the minutes
    while (dateMilliseconds > minute) {
        minutesLeft++;

        dateMilliseconds -= minute;
    }

    //and the seconds
    secondsLeft = round(dateMilliseconds / 1000, 2);

    // :: construct the string :: //

    var theDate = [
        ["day", daysLeft],
        ["hour", hoursLeft],
        ["minute", minutesLeft],
        ["second", secondsLeft],
    ];

    var constructDate = function(dateTmp: string, numberOf: number) {
        // day to days, hour to hours...
        if (numberOf !== 1) {
            dateTmp += "s";
        } else {
            dateTmp += "&nbsp;"; // add a space when not adding the 's', so that the width ends up the same (otherwise the text moves a bit when passing through these cases)
        }

        return numberOf.toFixed(1) + " " + dateTmp + " ";
    };

    // limit the number of units to be shown (days/hours, or hours/minutes or minutes/seconds, and not days/hours/minutes for example)
    var totalUnits = 2;

    var date = "";

    for (let i = 0; i < theDate.length; i++) {
        const dateInfo = theDate[i];
        const dateUnit = dateInfo[0] as string;
        const dateValue = dateInfo[1] as number;

        // reached the limit of the units
        if (totalUnits === 0) {
            break;
        }

        // only show when there's something relevant to be shown
        // (for example: 0 days 2 hours 2 minutes... no point showing the days part)
        if (theDate[i][1] !== 0) {
            date += constructDate(dateUnit, dateValue);

            totalUnits--;
        }
    }

    return date;
}
