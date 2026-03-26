class Urls {
    constructor() {
        const { protocol, host } = window.location;
        this.url = `${protocol}//${host}`;
    }

    getDogs(title) {
        if (title) {
            return `${this.url}/dogs?title=${title}`
        }
        return `${this.url}/dogs`
    }

    getDogById(id) {
        return `${this.url}/dogs/${id}`
    }

    createDog() {
        return `${this.url}/dogs`
    }

    updateDog(id) {
        return `${this.url}/dogs/${id}`
    }

    deleteDog(id) {
        return `${this.url}/dogs/${id}`
    }
}

export const urls = new Urls()
