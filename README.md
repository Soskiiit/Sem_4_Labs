# ЛР №5. Добавление AJAX-запросов к API

## Содержание

1. [Задание](#задание)
2. [Цель](#цель)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Дополнительные задания с защиты](#дополнительные-задания-с-защиты)
    - [Задание 1. Фильтрация карточек по названию через query-параметр](#задание-1-фильтрация-карточек-по-названию-через-query-параметр)
    - [Задание 2. Удаление карточки через DELETE-запрос](#задание-2-удаление-карточки-через-delete-запрос)
    - [Задание 3. Редактирование карточки через PATCH-запрос с динамическим аккордеоном](#задание-3-редактирование-карточки-через-patch-запрос-с-динамическим-аккордеоном)

## Задание

Перевести клиентскую часть приложения на взаимодействие с внешним API через `XMLHttpRequest`:

1. Реализовать отдельный слой `modules` для работы с сетью:
    - модуль с эндпоинтами API (`modules/urls.js`);
    - модуль-обёртку над `XMLHttpRequest` с методами `GET`, `POST`, `PATCH`, `DELETE` (`modules/ajax.js`).
2. Главную страницу перевести с отрисовки из статического объекта на получение списка карточек из API.
3. Страницу отдельной карточки перевести на получение данных по `id` из API.
4. Выполнить задания по своему варианту (фильтрация, создание, редактирование, удаление, пагинация — в зависимости от варианта).
5. Разобраться с политикой CORS и поднять связку «фронт + бекенд» так, чтобы запросы доходили до сервера.

## Цель

Изучить механизм AJAX-запросов в браузере, научиться взаимодействовать с внешним API из клиентского кода без перезагрузки страницы, а также вынести работу с сетью в отдельный слой приложения, чтобы страницы оставались ответственными только за отрисовку и пользовательское взаимодействие.

## Вариант и референсы

**Вариант:** МГТУ. Построение маршрутов.

Референсы и вспомогательные материалы, использовавшиеся при выполнении работы:

- [MDN — XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) — базовая документация по XHR.
- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — политика межсайтовых запросов, простые и сложные запросы, preflight.
- [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino) — расширение для обхода CORS на этапе разработки.
- [Bootstrap 5](https://getbootstrap.com/) — для стилизации карточек, формы редактирования и аккордеона.
- Предыдущие лабораторные работы курса — источник структуры проекта (`pages` / `components`) и готового бекенда с эндпоинтами.

## Дополнительные задания с защиты

Ниже приведены три дополнительных вопроса/задания, прозвучавших на защите, и уже реализованные в проекте фрагменты кода, которые являются ответом на них.

### Задание 1. Фильтрация карточек по названию через query-параметр

**Вопрос:** «Добавьте на главную страницу компонент поиска, чтобы список карточек фильтровался по названию через query-параметр GET-запроса, а не на клиенте».

Эндпоинт формирует query-параметр `title` на лету (`modules/urls.js`):

```js
getDogs(title) {
    if (title) {
        return `${this.url}/dogs?title=${title}`
    }
    return `${this.url}/dogs`
}
```

Компонент поиска вешает обработчики и на клик по кнопке, и на нажатие `Enter` (`components/search/index.js`):

```js
addListeners(listener) {
    document.getElementById('search-btn').addEventListener('click', listener)

    document.getElementById('search-input').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                listener()
            }
        })
}
```

На главной странице значение из инпута пробрасывается в `getData`, который и дергает API с нужным query (`pages/main/index.js`):

```js
getData(title) {
    ajax.get(urls.getDogs(title), (data) => {
        this.renderData(data)
    })
}

clickSearch() {
    const value = document.getElementById('search-input').value
    this.getData(value)
}
```

### Задание 2. Удаление карточки через DELETE-запрос

**Вопрос:** «Сделайте так, чтобы пользователь мог удалить карточку со страницы просмотра, и после успешного удаления возвращался на список».

Отдельный эндпоинт под удаление (`modules/urls.js`):

```js
deleteDog(id) {
    return `${this.url}/dogs/${id}`
}
```

Универсальный `DELETE` в обёртке над XHR (`modules/ajax.js`):

```js
delete(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', url);
    xhr.send();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            this._handleResponse(xhr, callback);
        }
    };
}
```

Обработчик клика по кнопке «Удалить из каталога» выполняет запрос и после ответа возвращает пользователя на главную (`pages/product/index.js`):

```js
clickDelete() {
    ajax.delete(urls.deleteDog(this.id), (data) => {
        this.clickBack()
    })
}
```

### Задание 3. Редактирование карточки через PATCH-запрос с динамическим аккордеоном

**Вопрос:** «Добавьте страницу редактирования, причём блоки аккордеона можно добавлять и убирать прямо в форме, а сохранение должно уходить PATCH-запросом и не затирать остальные поля сущности».

Блоки аккордеона в форме добавляются динамически: новый пункт вставляется в конец контейнера, а кнопка «Убрать» становится недоступной, когда остался единственный блок (`pages/product-edit/index.js`):

```js
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
```

При сохранении собираются все пары title/text, валидируются и объединяются с уже загруженной сущностью через spread, чтобы PATCH не терял поля, которые форма не редактирует (`pages/product-edit/index.js`):

```js
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
```

Сам `PATCH` в обёртке над XHR выставляет `Content-Type: application/json` и отправляет сериализованное тело (`modules/ajax.js`):

```js
patch(url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            this._handleResponse(xhr, callback);
        }
    };
}
```
