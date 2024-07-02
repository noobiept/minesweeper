import { timeToString } from "./utilities.js";

export interface TimerArgs {
    update: (displayValue: string) => void;
}

export default class Timer {
    private args: TimerArgs;
    private interval_time: number;
    private is_active: boolean;
    private count_time: number;
    private interval_f?: number;

    constructor(args: TimerArgs) {
        this.args = args;
        this.interval_time = 100;
        this.is_active = false;
        this.count_time = 0;
        this.interval_f = undefined;

        this.updateUI();
    }

    /**
     * Start the timer from the previous count number.
     */
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

    /**
     * Stop the timer.
     */
    stop() {
        if (this.is_active === false) {
            return;
        }

        window.clearInterval(this.interval_f);
        this.interval_f = undefined;
        this.is_active = false;
    }

    /**
     * Stop the timer and reset the counter value.
     */
    reset() {
        this.stop();
        this.count_time = 0;
        this.updateUI();
    }

    /**
     * Is the timer active.
     */
    isActive() {
        return this.is_active;
    }

    /**
     * Returns the time that has passed since the start of the timer (in milliseconds).
     */
    getElapsedTime() {
        return this.count_time;
    }

    /**
     * Call the `update` callback that was given previously with the current time string.
     */
    updateUI() {
        let time = "---";

        if (this.count_time !== 0) {
            time = timeToString(this.count_time, true);
        }

        this.args.update(time);
    }
}
