import {DogCardComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";

export class DogPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    getData() {
        const id = parseInt(this.id);
        const allData = [
             {
                id: 1,
                src: "https://www.purinaone.ru/sites/default/files/2022-12/haski_3.jpg",
                title: "Сибирский Хаски",
                text: "Энергичная и дружелюбная порода.",
                accordionData: [
                    { title: "Уход", text: "Требует частого расчесывания шерсти." },
                    { title: "Дрессировка", text: "Сложно поддается дрессировке, требует терпения." },
                    { title: "Здоровье", text: "Не переносит жару." }
                ]
            },
            {
                id: 2,
                src: "https://storage.yandexcloud.net/yac-wh-sb-prod-s3-media-03005/uploads/breed/773/2014cfa8184d60cf8418d002cd9f6749.webp",
                title: "Золотистый Ретривер",
                text: "Очень умная и преданная собака.",
                 accordionData: [
                    { title: "Уход", text: "Нуждается в регулярном груминге." },
                    { title: "Дрессировка", text: "Легко обучается, любит выполнять команды." },
                    { title: "Здоровье", text: "Может страдать от аллергии." }
                ]
            },
            {
                id: 3,
                src: "https://storage.yandexcloud.net/yac-wh-sb-prod-s3-media-03005/uploads/breed/769/1148ff2b861215347b1401fda98a97c3.webp",
                title: "Бигль",
                text: "Любопытная и веселая гончая.",
                 accordionData: [
                    { title: "Уход", text: "Шерсть короткая, уход минимальный." },
                    { title: "Дрессировка", text: "Иногда упрямится, но хорошо мотивируется едой." },
                    { title: "Здоровье", text: "Склонность к ожирению." }
                ]
            },
        ]
        return allData.find(item => item.id === id);
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return (
            `
                <div id="product-page"></div>
            `
        )
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = this.getData()
        const product = new DogCardComponent(this.pageRoot)
        product.render(data)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

    }
}
