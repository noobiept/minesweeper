import { HighScoreData } from "./high_score.js";
import { OptionsData } from "./options.js";

export interface StorageData {
    minesweeper_high_score?: HighScoreData;
    minesweeper_options?: OptionsData;
}

/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `localStorage`.
 */
export function getData(
    keys: (keyof StorageData)[],
    callback: (data: StorageData) => void
) {
    const objects: StorageData = {};

    for (let a = 0; a < keys.length; a++) {
        const key = keys[a];
        const value = localStorage.getItem(key);

        objects[key] = value && JSON.parse(value);
    }

    callback(objects);
}

/**
 * Sets the given key/value into `localStorage`. Calls the `callback` when its done.
 * Converts the value to string (with json).
 */
export function setData(items: StorageData, callback?: () => void) {
    for (const key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {
            const dataKey = key as keyof StorageData;
            localStorage.setItem(key, JSON.stringify(items[dataKey]));
        }
    }

    if (callback) {
        callback();
    }
}
