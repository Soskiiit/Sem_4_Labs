class Ajax {
    async _handleResponse(response) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    async get(url) {
        try {
            const response = await fetch(url);
            return await this._handleResponse(response);
        } catch (error) {
            console.error('Ошибка GET-запроса:', error);
            throw error;
        }
    }

    async post(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error('Ошибка POST-запроса:', error);
            throw error;
        }
    }

    async patch(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error('Ошибка PATCH-запроса:', error);
            throw error;
        }
    }

    async delete(url) {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            return await this._handleResponse(response);
        } catch (error) {
            console.error('Ошибка DELETE-запроса:', error);
            throw error;
        }
    }
}

export const ajax = new Ajax();
