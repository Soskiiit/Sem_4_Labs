import {DogCardComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {DogEditPage} from "../../pages/product-edit/index.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class DogPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    async getDataAndRender() {
        const data = await ajax.get(urls.getDogById(this.id))
        this.renderData(data)
    }

    renderData(item) {
        const product = new DogCardComponent(this.pageRoot)
        product.render(
            {...item, src: item.image_src},
            this.clickDelete.bind(this),
            this.clickEdit.bind(this)
        )
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

    async clickDelete() {
        await ajax.delete(urls.deleteDog(this.id))
        this.clickBack()
    }

    clickEdit() {
        const dogEditPage = new DogEditPage(this.parent, this.id)
        dogEditPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        this.getDataAndRender()
    }
}
