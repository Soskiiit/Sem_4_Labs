import {DogCardComponent} from "../../components/product-card/index.js";
import {DogPage} from "../product/index.js";
import {SearchComponent} from "../../components/search/index.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

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
            <div id="search-container"></div>    
            <div id="main-page" class="d-flex flex-wrap justify-content-center"></div>
            `
        )
    }

    async getData(title) {
        const data = await ajax.get(urls.getDogs(title))
        this.renderData(data)
    }

    renderData(items) {
        this.pageRoot.innerHTML = ''
        items.forEach((item) => {
            const dogCard = new DogCardComponent(this.pageRoot)
            dogCard.render({...item, src: item.image_src}, this.clickCard.bind(this))
        })
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
        const dogPage = new DogPage(this.parent, cardId)
        dogPage.render()
    }

    clickSearch() {
        const value = document.getElementById('search-input').value
        this.getData(value)
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const search = new SearchComponent(document.getElementById('search-container'))
        search.render(this.clickSearch.bind(this))

        this.getData()
    }
}
