export class AccordionComponent {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
    }

    getHTML(id, title, content) {
        return (
            `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${id}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${id}" aria-expanded="false" aria-controls="collapse-${id}">
                            ${title}
                        </button>
                    </h2>
                    <div id="collapse-${id}" class="accordion-collapse collapse" aria-labelledby="heading-${id}" data-bs-parent="#${this.name}">
                        <div class="accordion-body">
                            ${content}
                        </div>
                    </div>
                </div>
            `
        )
    }

    render(data) {
        const html = `
            <div class="accordion" id="${this.name}">
                ${data.map((item, index) => this.getHTML(index, item.title, item.text)).join('')}
            </div>
        `;
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
