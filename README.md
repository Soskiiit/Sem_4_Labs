# Лабораторная работа №6. Знакомство с `Promise` и `fetch`, сборка клиентской части

## Содержание отчёта

1. [Задание](#задание)
2. [Цель](#цель)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Как запустить](#как-запустить)
5. [Дополнительные задания (защита)](#дополнительные-задания-защита)
    - [Задание 1. Единая обёртка над `fetch` с универсальными методами](#задание-1-единая-обёртка-над-fetch-с-универсальными-методами)
    - [Задание 2. Динамическое добавление и удаление разделов аккордеона с перенумерацией](#задание-2-динамическое-добавление-и-удаление-разделов-аккордеона-с-перенумерацией)
    - [Задание 3. Поиск по нажатию `Enter`, а не только по кнопке](#задание-3-поиск-по-нажатию-enter-а-не-только-по-кнопке)

## Задание

Лабораторная состоит из двух частей:

1. **Часть 1.** Переписать механизм взаимодействия с внешним API: заменить использование `XMLHttpRequest` из предыдущей лабораторной на современный `fetch`, основанный на промисах. В ходе работы — разобраться с теорией (`Promise`, `async/await`, `fetch`) и выполнить задания по варианту.
2. **Часть 2.** Собрать клиентскую часть приложения с помощью системы сборки (`Vite`), а в серверной части (ЛР №4) настроить раздачу клиентской сборки в качестве статики, чтобы уйти от проблем с CORS.

Дополнительно — доработать предыдущую ЛР и по своему варианту заменить все обращения `XMLHttpRequest` на `fetch`.

## Цель

- Познакомиться с объектом `Promise`, его состояниями (`pending`, `fulfilled`, `rejected`) и цепочкой методов `then / catch / finally`.
- Освоить синтаксический сахар `async / await` для линейной записи асинхронного кода.
- Перевести клиент-серверное взаимодействие с `XMLHttpRequest` на `fetch`.
- Настроить сборку фронтенда через `Vite` (команды `dev`, `build`, `preview`) и раздачу готовой сборки из `public/` в качестве статики бэкендом.

## Вариант и референсы

- **Вариант:** МГТУ. Построение маршрутов между корпусами.
- **Реализация:** справочник-каталог сущностей (корпусов/объектов) с CRUD: просмотр списка, просмотр карточки с подробным описанием, редактирование, удаление, поиск по названию. В качестве «предметной» оболочки над CRUD взята небольшая энциклопедия пород собак — карточка содержит изображение, название, описание и произвольное количество разделов аккордеона, по той же механике, по которой карточка корпуса хранила бы описание и блоки с информацией (маршруты, расписание, контакты и т.п.).
- **Данные:** REST API собственного бэкенда (ЛР №4) — эндпоинты `/dogs`, `/dogs/:id`.
- **Сборка:** [Vite](https://vite.dev/) — выходная директория `public/`, конфиг в `vite.config.js`.
- **UI-фреймворк:** [Bootstrap 5](https://getbootstrap.com/) (подключён как зависимость).
- **Документация по `fetch`:** [learn.javascript.ru/fetch](https://learn.javascript.ru/fetch).

## Как запустить

Установить зависимости:

```sh
npm install
```

Собрать «в прод»:

```sh
npm run build
```

В директории `public/` появится готовый к раздаче фронтенд.

Dev-режим:

```sh
npm run dev
```

Превью production-сборки:

```sh
npm run preview
```

## Дополнительные задания (защита)

### Задание 1. Единая обёртка над `fetch` с универсальными методами

> **Вопрос:** точки API дергаются из разных мест (список, карточка, редактирование, удаление). Вынеси работу с `fetch` в отдельный модуль, чтобы `GET/POST/PATCH/DELETE` имели единый интерфейс, одинаково парсили JSON и обрабатывали пустое тело ответа.

Реализовано в `modules/ajax.js` — класс `Ajax` с методом `_handleResponse`, корректно обрабатывающим пустой ответ (`DELETE` без тела), и async-методами под каждый HTTP-глагол:

```js
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

    async patch(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return {"data": await this._handleResponse(response), "status": response.status};
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
```

Метод `patch` дополнительно возвращает пару `{ data, status }` — это используется на странице редактирования, чтобы различать успех и ошибку по HTTP-статусу.

### Задание 2. Динамическое добавление и удаление разделов аккордеона с перенумерацией

> **Вопрос:** у карточки породы есть произвольное количество разделов аккордеона. В форме редактирования нужна возможность добавлять/удалять разделы «на лету», причём кнопка удаления должна блокироваться, если остался последний раздел, а номера разделов должны перестраиваться.

Реализовано в `pages/product-edit/index.js`. При клике по «Добавить» в контейнер дописывается HTML нового раздела и обновляется состояние кнопки удаления. При клике по «Убрать» последний раздел снимается, оставшиеся перенумеровываются, а кнопка блокируется, если остался один:

```js
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
```

Сбор данных из формы обратно в массив объектов выполняется отдельным методом `getAccordionDataFromForm`, он же используется при валидации перед сохранением (`clickSave` запрещает отправку, если хотя бы один раздел заполнен не полностью).

### Задание 3. Поиск по нажатию `Enter`, а не только по кнопке

> **Вопрос:** пользователю неудобно каждый раз тянуться к кнопке «Искать». Сделай так, чтобы нажатие `Enter` в поле поиска запускало тот же обработчик, что и клик по кнопке.

Реализовано в `components/search/index.js`. Один и тот же колбэк подписан сразу на `click` кнопки и на событие `keypress` с фильтром по `event.key === 'Enter'`:

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

Сам листенер (`MainPage.clickSearch`) читает текущее значение инпута и перезапрашивает список — логика переиспользуется без дублирования:

```js
clickSearch() {
    const value = document.getElementById('search-input').value
    this.getData(value)
}
```
