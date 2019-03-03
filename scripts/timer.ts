import { timeToString } from "./utilities.js";

export interface TimerArgs {
    update: (displayValue: string) => void;
}

export default class Timer {
    args: TimerArgs;
    interval_time: number;
    is_active: boolean;
    count_time: number;
    interval_f?: number;

    constructor(args: TimerArgs) {
        this.args = args;
        this.interval_time = 100;
        this.is_active = false;
        this.count_time = 0;
        this.interval_f = undefined;

        this.updateUI();
    }

    start() {
        if (this.is_active === true) {
            return;
        }

        this.is_active = true;

        this.interval_f = window.setInterval(() => {
            this.count_time += this.interval_time;
            this.updateUI();
        }, this.interval_time);
    }

    stop() {
        if (this.is_active === false) {
            return;
        }

        window.clearInterval(this.interval_f);
        this.interval_f = undefined;
        this.is_active = false;
    }

    reset() {
        this.stop();
        this.count_time = 0;
        this.updateUI();
    }

    isActive() {
        return this.is_active;
    }

    getElapsedTime() {
        return this.count_time;
    }

    updateUI() {
        let time = "---";

        if (this.count_time !== 0) {
            time = timeToString(this.count_time);
        }

        this.args.update(time);
    }
}
