import {AccordionComponent} from "../accordion/index.js";

export class DogCardComponent {
    constructor(parent) {
        this.parent = parent
    }

    getHTML(data) {
        return (
            `
                <div class="card mb-3" style="width: 800px; margin: 20px auto;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${data.src}" class="img-fluid rounded-start" alt="картинка">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title text-center text-uppercase fs-2 fw-bold">${data.title}</h5>
                                <p class="card-text">${data.text}</p>
                                <div id="accordion-container"></div>
                                <div id="delete-btn-container" class="d-flex justify-content-end gap-2">
                                    <button class="btn btn-warning mt-3" id="edit-btn">Редактировать</button>
                                    <button class="btn btn-danger mt-3" id="delete-btn">Удалить из каталога</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
    }

    render(data, deleteListener, editListener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('afterbegin', html)
        
        const accordionContainer = document.getElementById('accordion-container')
        const accordion = new AccordionComponent(accordionContainer, 'dog-accordion')
        accordion.render(data.accordionData)
        
        document.getElementById('delete-btn').addEventListener('click', deleteListener)
        document.getElementById('edit-btn').addEventListener('click', editListener)
    }
}
