import {DogCardComponent} from "../../components/product-card/index.js";
import {DogPage} from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `
            <h1 class="text-center m-3">Породы собак</h1>    
            <div id="main-page" class="d-flex flex-wrap justify-content-center"></div>
            `
        )
    }

    getData() {
        return [
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
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
        const dogPage = new DogPage(this.parent, cardId)
        dogPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = this.getData()
        data.forEach((item) => {
            const dogCard = new DogCardComponent(this.pageRoot)
            dogCard.render(item, this.clickCard.bind(this))
        })
    }
}
