import * as AppStorage from "./app_storage.js";

export interface OptionsData {
    columnSize: number;
    lineSize: number;
    numberOfMines: number;
}

type OptionsKey = keyof OptionsData;

let OPTIONS: OptionsData;
const DEFAULT: OptionsData = {
    columnSize: 9,
    lineSize: 9,
    numberOfMines: 10,
};

/**
 * Initialize the options (or use the default ones).
 */
export function load(data?: OptionsData) {
    if (data) {
        OPTIONS = data;
    } else {
        OPTIONS = DEFAULT;
    }
}

/**
 * Get the current value of the given option.
 */
export function getOption(key: OptionsKey) {
    return OPTIONS[key];
}

/**
 * Set a new value to the specified option.
 */
export function setOption(key: OptionsKey, value: OptionsData[OptionsKey]) {
    OPTIONS[key] = value;
    save();
}

/**
 * Save to local storage.
 */
function save() {
    AppStorage.setData({ minesweeper_options: OPTIONS });
}
