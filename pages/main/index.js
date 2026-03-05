import {DogPage} from "../product/index.js";
import {SortDataByTitle} from "../../src/utils.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        const data = [
            {
                id: 1,
                src: "https://www.purinaone.ru/sites/default/files/2022-12/haski_3.jpg",
                title: "Сибирский Хаски",
                text: "Энергичная и дружелюбная порода."
            },
            {
                id: 2,
                src: "https://storage.yandexcloud.net/yac-wh-sb-prod-s3-media-03005/uploads/breed/773/2014cfa8184d60cf8418d002cd9f6749.webp",
                title: "Золотистый Ретривер",
                text: "Очень умная и преданная собака."
            },
            {
                id: 3,
                src: "https://storage.yandexcloud.net/yac-wh-sb-prod-s3-media-03005/uploads/breed/769/1148ff2b861215347b1401fda98a97c3.webp",
                title: "Бигль",
                text: "Любопытная и веселая гончая."
            },
        ]
        return SortDataByTitle(data, 'title')
    }

    getCarouselHTML(data) {
        const indicators = data.map((_, i) =>
            `<button type="button" data-bs-target="#dogCarousel" data-bs-slide-to="${i}" ${i === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${i + 1}"></button>`
        ).join('')

        const slides = data.map((item, i) =>
            `<div class="carousel-item ${i === 0 ? 'active' : ''}">
                <img src="${item.src}" class="d-block w-100" alt="${item.title}" style="height: 700px; object-fit: cover;">
                <div class="carousel-caption d-block bg-dark bg-opacity-50 rounded p-3">
                    <h5>${item.title}</h5>
                    <p>${item.text}</p>
                    <button class="btn btn-primary" id="click-card-${item.id}" data-id="${item.id}">Подробнее</button>
                </div>
            </div>`
        ).join('')

        return `
            <h1 class="text-center m-3">Породы собак</h1>
            <div id="dogCarousel" class="carousel slide mx-auto" style="max-width: 90%;" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    ${indicators}
                </div>
                <div class="carousel-inner">
                    ${slides}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#dogCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Назад</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#dogCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Вперёд</span>
                </button>
            </div>
        `
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
        const dogPage = new DogPage(this.parent, cardId)
        dogPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const data = this.getData()
        const html = this.getCarouselHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)

        data.forEach((item) => {
            document
                .getElementById(`click-card-${item.id}`)
                .addEventListener("click", this.clickCard.bind(this))
        })
    }
}
