import { getAsset, addToStage, removeFromStage } from "./main.js";

export enum SquareState {
    hidden, // still hasn't been shown
    revealed, // by clicking on the square, we find out its value
    question_mark, // we think its a mine in that position, just a visual help
    mine_flag, // marks the square as containing a mine, again just to help
}

// the string values match the images ids that get pre-loaded at the start of the application
export enum SquareValue {
    mine = "mine",
    blank = "blank",
    one = "1",
    two = "2",
    three = "3",
    four = "4",
    five = "5",
    six = "6",
    seven = "7",
    eight = "8",
}

export interface SquareArgs {
    column: number;
    line: number;
    onStateChange: (previous: SquareState, next: SquareState) => void;
}

export default class Square {
    static size = 30; // size of each individual square (30x30 pixels)

    readonly column: number;
    readonly line: number;
    private value: SquareValue;
    private state: SquareState;
    private container: createjs.Container;
    private background: createjs.Bitmap;
    private front: createjs.Bitmap;
    private onStateChange: (previous: SquareState, next: SquareState) => void;

    constructor(args: SquareArgs) {
        const column = args.column;
        const line = args.line;

        this.value = SquareValue.blank;
        this.column = column;
        this.line = line;
        this.state = SquareState.hidden;
        this.onStateChange = args.onStateChange;

        const container = new createjs.Container();

        const background = new createjs.Bitmap(getAsset("hidden"));
        const front = new createjs.Bitmap(getAsset("question_mark")); // need to initialize with an image, but its not visible initially
        front.visible = false;

        container.addChild(background);
        container.addChild(front);

        container.x = column * Square.size;
        container.y = line * Square.size;

        addToStage(container);

        this.container = container;
        this.background = background;
        this.front = front;
    }

    /**
     * Get the current value of the square.
     */
    getValue() {
        return this.value;
    }

    /**
     * Get the current state of the square.
     */
    getState() {
        return this.state;
    }

    /**
     * Change the square to a different state.
     */
    setState(state: SquareState) {
        if (state === this.state) {
            return;
        }

        this.onStateChange(this.state, state);
        this.state = state;

        if (state === SquareState.hidden) {
            this.background.image = getAsset("hidden");
            this.front.visible = false;
        } else if (state === SquareState.revealed) {
            this.background.image = getAsset(this.value);
            this.front.visible = false;
        } else if (state === SquareState.question_mark) {
            this.background.image = getAsset("hidden");
            this.front.image = getAsset("question_mark");
            this.front.visible = true;
        } else if (state === SquareState.mine_flag) {
            this.background.image = getAsset("hidden");
            this.front.image = getAsset("mine_flag");
            this.front.visible = true;
        } else {
            throw new Error("Wrong state argument.");
        }
    }

    /**
     * Select the square (when the mouse is over it).
     */
    select() {
        if (this.state !== SquareState.revealed) {
            this.background.image = getAsset("hidden_mouse_over");
        }
    }

    /**
     * Un-select the square (when the mouse is not over it).
     */
    unSelect() {
        if (this.state !== SquareState.revealed) {
            this.background.image = getAsset("hidden");
        }
    }

    /**
     * 'numberOfMines': -1 if there's a mine, otherwise its a number between 0 and 8 (and the correspondent square value).
     */
    setValue(numberOfMines: number | SquareValue) {
        if (typeof numberOfMines !== "number") {
            this.value = numberOfMines;
        }

        switch (numberOfMines) {
            case 0:
                this.value = SquareValue.blank;
                break;

            case 1:
                this.value = SquareValue.one;
                break;

            case 2:
                this.value = SquareValue.two;
                break;

            case 3:
                this.value = SquareValue.three;
                break;

            case 4:
                this.value = SquareValue.four;
                break;

            case 5:
                this.value = SquareValue.five;
                break;

            case 6:
                this.value = SquareValue.six;
                break;

            case 7:
                this.value = SquareValue.seven;
                break;

            case 8:
                this.value = SquareValue.eight;
                break;

            default:
                this.value = SquareValue.mine;
                break;
        }
    }

    /**
     * Remove the square from the stage.
     */
    clear() {
        removeFromStage(this.container);
    }
}
