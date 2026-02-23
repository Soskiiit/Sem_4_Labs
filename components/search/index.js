export class SearchComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return (
            `
                <div class="input-group mb-3" style="width: 500px; margin: 20px auto;">
                    <input type="text" class="form-control" id="search-input" placeholder="Введите название..." aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="btn btn-primary" type="button" id="search-btn">Искать</button>
                </div>
            `
        )
    }

    addListeners(listener) {
        document.getElementById('search-btn').addEventListener('click', listener)
        
        document.getElementById('search-input').addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    listener()
                }
            })
    }

    render(listener) {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
    }
}
