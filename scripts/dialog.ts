export interface DialogArgs {
    title: string;
    body: string;
    buttonText: string;
    onClose: () => void;
}

export default class Dialog {
    overlay: HTMLElement;
    container: HTMLElement;

    constructor(args: DialogArgs) {
        const overlay = document.createElement("div");
        overlay.className = "overlay";

        const container = document.createElement("div");
        container.className = "dialog";

        const title = document.createElement("div");
        title.innerText = args.title;
        title.className = "dialog-title";

        const body = document.createElement("div");
        body.innerText = args.body;
        body.className = "dialog-body";

        const buttons = document.createElement("div");
        buttons.className = "dialog-buttons";

        const ok = document.createElement("button");
        ok.className = "dialog-button";
        ok.onclick = args.onClose;
        ok.innerText = args.buttonText;

        const horizontalRule = document.createElement("hr");
        horizontalRule.className = "dialog-hr";

        container.appendChild(title);
        container.appendChild(body);
        container.appendChild(horizontalRule);
        container.appendChild(buttons);
        buttons.appendChild(ok);

        document.body.appendChild(overlay);
        document.body.appendChild(container);

        this.overlay = overlay;
        this.container = container;
    }

    remove() {
        document.body.removeChild(this.container);
        document.body.removeChild(this.overlay);
    }
}
