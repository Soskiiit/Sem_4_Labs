# ЛР 3. Простое web-приложение на JavaScript + Bootstrap (2 страницы)

## Содержание

- [Задание](#задание)
- [Цель работы](#цель-работы)
- [Вариант и референсы](#вариант-и-референсы)
- [Структура проекта](#структура-проекта)
- [Краткое описание реализации](#краткое-описание-реализации)
- [Доп. вопросы на защите и доработки (3 шт.)](#доп-вопросы-на-защите-и-доработки-3-шт)

## Задание

1. Реализовать простое **двухстраничное** веб-приложение на **чистом JavaScript**.
2. Использовать компоненты из **Bootstrap**.
3. На главной странице вывести список/витрину элементов (в проекте — **породы собак**).
4. По клику на элемент открыть страницу подробностей.
5. Реализовать кнопку возврата на главную страницу.
6. Добавить компонент по варианту.

## Цель работы

- Познакомиться с экосистемой **Node.js / npm** и подключением зависимостей через `package.json`.
- Закрепить работу с **DOM API** (`getElementById`, `insertAdjacentHTML`, `addEventListener`).
- Научиться структурировать фронтенд-проект на **pages** и **components**.

## Вариант и референсы

**Вариант:** 1 — тема *собаки*, компонент Bootstrap — *аккордеон*.

**Как вариант реализован в проекте:**
- Главная страница (`pages/main`) — **карусель Bootstrap** со слайдами пород и кнопкой «Подробнее».
- Страница породы (`pages/product`) — карточка с описанием + **аккордеон** с дополнительной информацией.
- Дополнительно: 3D-просмотр модели (Three.js) на странице породы.

**Референсы:**
- Bootstrap Carousel: https://getbootstrap.com/docs/5.3/components/carousel/
- Bootstrap Accordion: https://getbootstrap.com/docs/5.3/components/accordion/
- Three.js (документация): https://threejs.org/docs/
- GLTFLoader: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- OrbitControls: https://threejs.org/docs/#examples/en/controls/OrbitControls

## Структура проекта

Ключевые директории и файлы:

- `index.html` — корневой HTML + подключение Bootstrap.
- `main.js` — точка входа, рендер главной страницы.
- `pages/`
  - `main/index.js` — `MainPage` (главная страница с каруселью).
  - `product/index.js` — `DogPage` (страница конкретной породы).
- `components/`
  - `accordion/index.js` — `AccordionComponent` (Bootstrap accordion) + обработка диапазонов.
  - `product/index.js` — `DogCardComponent` (карточка породы + слоты под accordion/3D).
  - `back-button/index.js` — `BackButtonComponent`.
  - `three-viewer/index.js` — `ThreeViewerComponent` (Three.js + GLTF).
- `src/utils.js` — утилиты (сортировка).
- `src/data/dogs.json` — заготовка под данные (в текущей версии не используется, данные хардкодом в страницах).
- `models/scooby-doo.glb` — 3D-модель для просмотра.

## Краткое описание реализации

### Главная страница (`MainPage`)

- Данные формируются в `getData()` и сортируются через `SortDataByTitle(..., 'title')`.
- HTML карусели генерируется в `getCarouselHTML(data)`.
- клики по кнопке «Подробнее» навешиваются на элементы `#click-card-{id}` и открывают `DogPage`.

### Страница породы (`DogPage`)

- По `id` выбирается объект породы (`getData()` делает поиск в массиве).
- Рендерится `DogCardComponent`.
- Внутри карточки создаётся аккордеон (`AccordionComponent`) по полю `accordionData`.
- Отдельно в слот `#three-viewer-slot` добавляется `ThreeViewerComponent` и загружается `models/scooby-doo.glb`.
- Внизу страницы рисуется `BackButtonComponent`, возвращающий на `MainPage`.

---

## Доп. вопросы на защите и доработки

### 1) Карусель на главной странице (Bootstrap Carousel + динамическая генерация)

**Вопрос:** как сделать карусель Bootstrap, если данные хранятся в массиве объектов, и нужно динамически сгенерировать индикаторы/слайды?

**Реализация в проекте:** генерация HTML через `map()` в `MainPage.getCarouselHTML(data)`.

Сниппет из `pages/main/index.js`:

```text
getCarouselHTML(data) {
    const indicators = data.map((_, i) =>
        `<button type="button" data-bs-target="#dogCarousel" data-bs-slide-to="${i}" ${i === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${i + 1}"></button>`
    ).join('')

    const slides = data.map((item, i) =>
        `<div class="carousel-item ${i === 0 ? 'active' : ''}">
            <img src="${item.src}" class="d-block w-100" alt="${item.title}" style="height: 700px; object-fit: cover; ">
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
```

### 2) Кнопка «Назад» под карточкой на странице деталей

**Вопрос:** как на странице деталей разместить кнопку возврата отдельно от карточки и привязать обработчик через `addEventListener`?

**Реализация в проекте:**
- на странице `DogPage` кнопка рендерится **после** карточки и 3D-вьювера;
- разметка кнопки генерируется в `BackButtonComponent.getHTML()`, обработчик в `addListeners()`.

Сниппет из `pages/product/index.js` (порядок рендера):

```text
const data = this.getData()
const product = new DogCardComponent(this.pageRoot)
product.render(data)

const viewerSlot = document.getElementById('three-viewer-slot')
if (viewerSlot) {
    const viewer = new ThreeViewerComponent(viewerSlot)
    viewer.render('models/scooby-doo.glb')
}

const backButton = new BackButtonComponent(this.pageRoot)
backButton.render(this.clickBack.bind(this))
```

Сниппет из `components/back-button/index.js`:

```text
addListeners(listener) {
    document
        .getElementById("back-button")
        .addEventListener("click", listener)
}

getHTML() {
    return (
        `
            <div style="width: 800px; margin: 0 auto; display: flex; justify-content: flex-end;">
                <button id="back-button" class="btn btn-secondary" type="button" style="margin-bottom: 20px;">Назад</button>
            </div>
        `
    )
}
```

### 3) Доп. поле для аккордеона + обработка «диапазонов» значений

**Вопрос:** как расширять аккордеон дополнительными полями и при этом сделать «умную» обработку (применить функцию из ДЗ)?

**Реализация в проекте:**
- `accordionData` содержит несколько полей (например: «Уход», «Дрессировка», «Здоровье», «Рекомендуемый возраст осмотров»);
- в `AccordionComponent.processItem()` есть спец-обработка пункта **«Рекомендуемый возраст осмотров»**: числа схлопываются в диапазоны.

Сниппет из `components/accordion/index.js`:

```text
function collapseRanges(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        return '';
    }

    const sorted = [...new Set(numbers)].sort((a, b) => a - b);
    const ranges = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === end + 1) {
            end = sorted[i];
        } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = sorted[i];
            end = sorted[i];
        }
    }

    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return ranges.join(', ');
}

processItem(item) {
    if (item.title === RANGES_TITLE) {
        const numbers = item.text.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        return { title: item.title, text: collapseRanges(numbers) };
    }
    return item;
}
```

И пример уже заполненного `accordionData` (фрагмент из `pages/product/index.js`):

```text
accordionData: [
    { title: "Уход", text: "Требует частого расчесывания шерсти." },
    { title: "Дрессировка", text: "Сложно поддается дрессировке, требует терпения." },
    { title: "Здоровье", text: "Не переносит жару." },
    { title: "Рекомендуемый возраст осмотров", text: "1,2,3,5,6,7,10,11,12,14" }
]
```

---

## Как запустить

- Установить зависимости:

```sh
npm install
```

- Запустить статический сервер (один из вариантов):

```sh
python3 -m http.server
```
