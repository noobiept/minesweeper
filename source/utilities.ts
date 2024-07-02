import { round } from "@drk4/utilities";

/**
 * Converts a time (in milliseconds) to a string (with the number of days/hours...).
 * The `sSpace` argument is about adding an extra space when the unit doesn't have the 's' at the end (to make sure it is aligned).
 *     For example (when true):
 *         1 minute  10 seconds
 *         2 minutes 10 seconds
 *     When false:
 *         1 minute 10 seconds
 *         2 minutes 10 seconds
 */
export function timeToString(dateMilliseconds: number, sSpace = false) {
    //in milliseconds
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;

    let minutesLeft = 0;
    let hoursLeft = 0;
    let daysLeft = 0;
    let secondsLeft = 0;

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
    const theDate = [
        ["day", daysLeft],
        ["hour", hoursLeft],
        ["minute", minutesLeft],
        ["second", secondsLeft],
    ];

    // limit the number of units to be shown (days/hours, or hours/minutes or minutes/seconds, and not days/hours/minutes for example)
    let totalUnits = 2;
    let date = "";

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
        if (dateValue !== 0) {
            // add a space to separate multiple units sections
            if (date !== "") {
                date += " ";
            }

            date += constructDate(dateUnit, dateValue, sSpace);
            totalUnits--;
        }
    }

    // always show something
    if (date === "") {
        date = "0 seconds";
    }

    return date;
}

/**
 * Helper function to the 'timeToString' function.
 */
function constructDate(dateTmp: string, numberOf: number, sSpace: boolean) {
    // a digit past the decimal case only to the 'second' values
    const numberStr =
        dateTmp === "second" ? numberOf.toFixed(1) : numberOf.toString();

    // day to days, hour to hours...
    if (numberOf !== 1) {
        dateTmp += "s";
    } else if (sSpace) {
        dateTmp += "&nbsp;"; // add a space when not adding the 's', so that the width ends up the same (otherwise the text moves a bit when passing through these cases)
    }

    return numberStr + " " + dateTmp;
}
