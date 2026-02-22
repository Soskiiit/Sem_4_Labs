export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById("back-button")
            .addEventListener("click", listener)
    }

    getHTML() {
        return (
            `
                <div style="width: 800px; margin: 0 auto; display: flex; justify-content: flex-end;">
                    <button id="back-button" class="btn btn-secondary" type="button" style="margin-bottom: 20px;">Назад</button>
                </div>
            `
        )
    }

    render(listener) {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
    }
}
