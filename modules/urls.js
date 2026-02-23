class Urls {
    constructor() {
        this.url = 'http://localhost:3000';
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
