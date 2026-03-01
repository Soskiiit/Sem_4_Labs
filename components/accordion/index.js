function collapseRanges(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        return '';
    }

    const sorted = [...new Set(numbers)].sort((a, b) => a - b);
    const ranges = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === end + 1) {
            end = sorted[i];
        } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = sorted[i];
            end = sorted[i];
        }
    }

    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return ranges.join(', ');
}

const RANGES_TITLE = 'Рекомендуемый возраст осмотров';

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

    processItem(item) {
        if (item.title === RANGES_TITLE) {
            const numbers = item.text.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
            return { title: item.title, text: collapseRanges(numbers) };
        }
        return item;
    }

    render(data) {
        const html = `
            <div class="accordion" id="${this.name}">
                ${data.map((item, index) => {
                    const processed = this.processItem(item);
                    return this.getHTML(index, processed.title, processed.text);
                }).join('')}
            </div>
        `;
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
