import {DogPage} from "../product/index.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class DogEditPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
        this.dog = null
    }

    get pageRoot() {
        return document.getElementById('product-edit-page')
    }

    getDataAndRender() {
        ajax.get(urls.getDogById(this.id), (data) => {
            this.dog = data
            this.renderData(data)
        })
    }

    getHTML() {
        return (
            `
                <div id="product-edit-page"></div>
            `
        )
    }

    getAccordionItemHTML(item, index) {
        return (
            `
                <div class="border rounded p-3 mb-3 accordion-item-block">
                    <h6 class="mb-3 accordion-item-title">Раздел ${index + 1}</h6>
                    <div class="mb-3">
                        <label for="accordion-title-${index}" class="form-label accordion-title-label">Заголовок раздела</label>
                        <input
                            type="text"
                            class="form-control accordion-title"
                            id="accordion-title-${index}"
                            value="${item.title ?? ''}"
                        >
                    </div>
                    <div>
                        <label for="accordion-text-${index}" class="form-label accordion-text-label">Текст раздела</label>
                        <textarea
                            class="form-control accordion-text"
                            id="accordion-text-${index}"
                            rows="3"
                        >${item.text ?? ''}</textarea>
                    </div>
                </div>
            `
        )
    }

    getAccordionFieldsHTML(data) {
        const accordionData = data.accordionData?.length ? data.accordionData : [{title: '', text: ''}]

        return `
            <div id="accordion-fields-container">
                ${accordionData.map((item, index) => this.getAccordionItemHTML(item, index)).join('')}
            </div>
        `
    }

    getFormHTML(data) {
        return (
            `
                <div class="card mb-3" style="width: 800px; margin: 20px auto;">
                    <div class="card-body">
                        <h5 class="card-title text-center text-uppercase fs-2 fw-bold mb-4">Редактирование карточки</h5>
                        <div class="mb-3">
                            <label for="edit-title" class="form-label"><b>Название породы</b></label>
                            <input type="text" class="form-control" id="edit-title" value="${data.title}">
                        </div>
                        <div class="mb-3">
                            <label for="edit-image-src" class="form-label"><b>Ссылка на изображение</b></label>
                            <input type="text" class="form-control" id="edit-image-src" value="${data.image_src}">
                        </div>
                        <div class="mb-3">
                            <label for="edit-text" class="form-label"><b>Описание</b></label>
                            <textarea class="form-control" id="edit-text" rows="5">${data.text}</textarea>
                        </div>
                        <div class="mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="mb-0">Разделы аккордеона</h5>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-success" type="button" id="accordion-add-btn">Добавить</button>
                                    <button class="btn btn-outline-danger" type="button" id="accordion-remove-btn">Убрать</button>
                                </div>
                            </div>
                            ${this.getAccordionFieldsHTML(data)}
                        </div>
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-secondary" id="cancel-btn">Отмена</button>
                            <button class="btn btn-success" id="save-btn">Сохранить</button>
                        </div>
                    </div>
                </div>
            `
        )
    }

    renderData(item) {
        const html = this.getFormHTML(item)
        this.pageRoot.insertAdjacentHTML('beforeend', html)
        document.getElementById('cancel-btn').addEventListener('click', this.clickBack.bind(this))
        document.getElementById('save-btn').addEventListener('click', this.clickSave.bind(this))
        document.getElementById('accordion-add-btn').addEventListener('click', this.clickAddAccordionItem.bind(this))
        document.getElementById('accordion-remove-btn').addEventListener('click', this.clickRemoveAccordionItem.bind(this))
        this.updateRemoveAccordionButtonState()
    }

    clickBack() {
        const dogPage = new DogPage(this.parent, this.id)
        dogPage.render()
    }

    getAccordionDataFromForm() {
        const titleInputs = document.querySelectorAll('.accordion-title')
        const textInputs = document.querySelectorAll('.accordion-text')
        const accordionData = []

        for (let i = 0; i < titleInputs.length; i++) {
            accordionData.push({
                title: titleInputs[i].value.trim(),
                text: textInputs[i].value.trim()
            })
        }

        return accordionData
    }

    updateRemoveAccordionButtonState() {
        const removeButton = document.getElementById('accordion-remove-btn')
        const accordionItemsCount = document.querySelectorAll('.accordion-item-block').length
        removeButton.disabled = accordionItemsCount <= 1
    }

    renumberAccordionItems() {
        const accordionItems = document.querySelectorAll('.accordion-item-block')

        accordionItems.forEach((item, index) => {
            const title = item.querySelector('.accordion-item-title')
            const titleLabel = item.querySelector('.accordion-title-label')
            const textLabel = item.querySelector('.accordion-text-label')
            const titleInput = item.querySelector('.accordion-title')
            const textInput = item.querySelector('.accordion-text')

            title.textContent = `Раздел ${index + 1}`
            titleLabel.setAttribute('for', `accordion-title-${index}`)
            textLabel.setAttribute('for', `accordion-text-${index}`)
            titleInput.id = `accordion-title-${index}`
            textInput.id = `accordion-text-${index}`
        })
    }

    clickAddAccordionItem() {
        const accordionContainer = document.getElementById('accordion-fields-container')
        const accordionItemsCount = document.querySelectorAll('.accordion-item-block').length
        accordionContainer.insertAdjacentHTML('beforeend', this.getAccordionItemHTML({title: '', text: ''}, accordionItemsCount))
        this.updateRemoveAccordionButtonState()
    }

    clickRemoveAccordionItem() {
        const accordionItems = document.querySelectorAll('.accordion-item-block')

        if (accordionItems.length <= 1) {
            return
        }

        accordionItems[accordionItems.length - 1].remove()
        this.renumberAccordionItems()
        this.updateRemoveAccordionButtonState()
    }

    clickSave() {
        const title = document.getElementById('edit-title').value.trim()
        const image_src = document.getElementById('edit-image-src').value.trim()
        const text = document.getElementById('edit-text').value.trim()
        const accordionData = this.getAccordionDataFromForm()

        const hasInvalidAccordionItem = accordionData.some((item) => !item.title || !item.text)

        if (!title || !image_src || !text || hasInvalidAccordionItem) {
            alert('Не все поля заполнены')
            return
        }

        const updatedDog = {
            ...this.dog,
            title,
            image_src,
            text,
            accordionData
        }

        ajax.patch(urls.updateDog(this.id), updatedDog, (data, status) => {
            if (status >= 200 && status < 300) {
                this.clickBack()
                return
            }
            alert('Не удалось сохранить изменения')
        })
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)


        this.getDataAndRender()
    }
}
