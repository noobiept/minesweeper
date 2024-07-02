import * as AppStorage from "./app_storage.js";

export interface HighScoreData {
    [name: string]: number[];
}

let HIGH_SCORE: HighScoreData = {};
const MAX_SCORES_SAVED = 5;

/**
 * Save the high-scores to the local storage.
 */
function save() {
    AppStorage.setData({ minesweeper_high_score: HIGH_SCORE });
}

/**
 * Load the given high-scores.
 */
export function load(score?: HighScoreData) {
    if (score) {
        HIGH_SCORE = score;
    }
}

/**
 * Add a new high-score. The score is the time it took to finish the map.
 * The score list is independent per combination of columns/lines/mines.
 * Only the best scores are saved.
 */
export function add(
    columns: number,
    lines: number,
    mines: number,
    time: number
) {
    const name = columns + "_" + lines + "_" + mines;

    if (typeof HIGH_SCORE[name] == "undefined") {
        HIGH_SCORE[name] = [];
    }

    HIGH_SCORE[name].push(time);

    // have the better scores first (better means a lesser value (finished the map faster))
    HIGH_SCORE[name].sort(function (a, b) {
        return a - b;
    });

    // if we pass the limit, remove one of the lesser scores
    if (HIGH_SCORE[name].length > MAX_SCORES_SAVED) {
        HIGH_SCORE[name].pop();
    }

    save();
}

/**
 * Get the high-scores of the given columns/lines/mines combination.
 */
export function get(columns: number, lines: number, mines: number) {
    const key = columns + "_" + lines + "_" + mines;

    if (typeof HIGH_SCORE[key] == "undefined") {
        return null;
    }

    return HIGH_SCORE[key];
}
