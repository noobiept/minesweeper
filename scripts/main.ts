import * as AppStorage from "./app_storage.js";
import * as HighScore from "./high_score.js";
import * as MineSweeper from "./minesweeper.js";
import * as Options from "./options.js";

let PRELOAD: createjs.LoadQueue;
let STAGE: createjs.Stage;
let CANVAS: HTMLCanvasElement;

window.onload = function() {
    AppStorage.getData(
        ["minesweeper_high_score", "minesweeper_options"],
        initApp
    );
};

function initApp(data: AppStorage.StorageData) {
    CANVAS = document.getElementById("MainCanvas") as HTMLCanvasElement;
    STAGE = new createjs.Stage(CANVAS);
    PRELOAD = new createjs.LoadQueue();
    PRELOAD.setMaxConnections(10);
    PRELOAD.maintainScriptOrder = false;

    // disable the context menu (when right-clicking)
    CANVAS.oncontextmenu = function(event) {
        return false;
    };

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick);

    var manifest = [
        { id: "1", src: "images/one.png" },
        { id: "2", src: "images/two.png" },
        { id: "3", src: "images/three.png" },
        { id: "4", src: "images/four.png" },
        { id: "5", src: "images/five.png" },
        { id: "6", src: "images/six.png" },
        { id: "7", src: "images/seven.png" },
        { id: "8", src: "images/eight.png" },
        { id: "blank", src: "images/blank.png" },
        { id: "mine", src: "images/mine.png" },
        { id: "hidden", src: "images/hidden.png" },
        { id: "hidden_mouse_over", src: "images/hidden_mouse_over.png" },
        { id: "question_mark", src: "images/question_mark.png" },
        { id: "mine_flag", src: "images/mine_flag.png" },
    ];

    Options.load(data["minesweeper_options"]);
    HighScore.load(data["minesweeper_high_score"]);

    var loadMessage = document.getElementById("LoadMessage")!;
    loadMessage.classList.remove("hidden");

    PRELOAD.addEventListener("progress", function(
        event: createjs.ProgressEvent
    ) {
        loadMessage.innerText = ((event.progress * 100) | 0) + "%";
    } as (event: Object) => void);
    PRELOAD.addEventListener("complete", function() {
        loadMessage.classList.add("hidden");

        MineSweeper.init();
    });
    PRELOAD.loadManifest(manifest, true);
}

/**
 * Get an image asset associated with the given `id`.
 */
export function getAsset(id: string) {
    return PRELOAD.getResult(id) as HTMLImageElement;
}

/**
 * Add an element to the stage (so it can be drawn).
 */
export function addToStage(element: createjs.DisplayObject) {
    STAGE.addChild(element);
}

/**
 * Remove an element from the stage.
 */
export function removeFromStage(element: createjs.DisplayObject) {
    STAGE.removeChild(element);
}

/**
 * Add some event listeners to the canvas element.
 */
export function addCanvasListeners(
    mouseMove: (event: MouseEvent) => void,
    mouseDown: (event: MouseEvent) => void
) {
    CANVAS.addEventListener("mousemove", mouseMove);
    CANVAS.addEventListener("mousedown", mouseDown);
}

/**
 * Get the `ClientRect` of the canvas element.
 */
export function getCanvasRect() {
    return CANVAS.getBoundingClientRect();
}

/**
 * Set a new width/height for the canvas element.
 */
export function setCanvasDimensions(width: number, height: number) {
    CANVAS.width = width;
    CANVAS.height = height;
}

/**
 * Draw at every tick.
 */
function tick() {
    STAGE.update();
}
