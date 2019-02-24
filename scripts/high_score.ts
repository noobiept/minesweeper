import * as AppStorage from "./app_storage.js";

export interface HighScoreData {
    [name: string]: number[];
}

var HIGH_SCORE: HighScoreData = {};
var MAX_SCORES_SAVED = 5;

function save() {
    AppStorage.setData({ minesweeper_high_score: HIGH_SCORE });
}

export function load(data?: AppStorage.StorageData) {
    if (data) {
        var score = data["minesweeper_high_score"];

        if (score) {
            HIGH_SCORE = score;
        }
    }
}

export function add(
    columns: number,
    lines: number,
    mines: number,
    time: number
) {
    var name = columns + "_" + lines + "_" + mines;

    if (typeof HIGH_SCORE[name] == "undefined") {
        HIGH_SCORE[name] = [];
    }

    HIGH_SCORE[name].push(time);

    // have the better scores first (better means a lesser value (finished the map faster))
    HIGH_SCORE[name].sort(function(a, b) {
        return a - b;
    });

    // if we pass the limit, remove one of the lesser scores
    if (HIGH_SCORE[name].length > MAX_SCORES_SAVED) {
        HIGH_SCORE[name].pop();
    }

    save();
}

export function getAll() {
    return HIGH_SCORE;
}

export function get(columns: number, lines: number, mines: number) {
    var key = columns + "_" + lines + "_" + mines;

    if (typeof HIGH_SCORE[key] == "undefined") {
        return null;
    }

    return HIGH_SCORE[key];
}
