export interface DialogArgs {
    title: string;
    body: string;
    buttonText: string;
    onClose: () => void;
}

export default class Dialog {
    overlay: HTMLElement;
    container: HTMLElement;
    onClose: () => void;

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
        ok.onclick = () => {
            this.close();
        };
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
        this.onClose = args.onClose;

        // setup some keyboard shortcuts
        this.onKeyDown = this.onKeyDown.bind(this);
        document.addEventListener("keydown", this.onKeyDown);
    }

    /**
     * Close the 'dialog' when pressing either the 'enter' or the 'escape' key.
     */
    onKeyDown(event: KeyboardEvent) {
        const key = event.key;

        switch (key) {
            case "Escape":
            case "r":
                this.close();
                break;
        }
    }

    /**
     * Close the dialog.
     */
    close() {
        this.remove();
        this.onClose();
    }

    remove() {
        document.body.removeChild(this.container);
        document.body.removeChild(this.overlay);

        document.removeEventListener("keydown", this.onKeyDown);
    }
}
