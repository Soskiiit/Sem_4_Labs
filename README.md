# Лабораторная работа №3. Разработка REST API на Express.js

## Содержание

1. [Задание](#задание)
2. [Цель](#цель)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Реализация](#реализация)
   - [Архитектура приложения](#архитектура-приложения)
   - [FileService — слой данных](#fileservice--слой-данных)
   - [StocksService — слой бизнес-логики](#stocksservice--слой-бизнес-логики)
   - [StocksController — слой обработки запросов](#stockscontroller--слой-обработки-запросов)
   - [Routes — маршрутизация](#routes--маршрутизация)
   - [Entry Point и middleware](#entry-point-и-middleware)
5. [Тестирование через Postman](#тестирование-через-postman)
6. [Дополнительные задания на защите](#дополнительные-задания-на-защите)

---

## Задание

Разработать REST API сервис карточек `Stock` на базе фреймворка **Express.js** со следующими эндпоинтами:

| Метод    | Путь           | Описание                                              |
|----------|----------------|-------------------------------------------------------|
| `GET`    | `/stocks`      | Получение всех карточек (с фильтрацией по `title`)    |
| `POST`   | `/stocks`      | Создание новой карточки                               |
| `GET`    | `/stocks/:id`  | Получение карточки по ID                              |
| `PATCH`  | `/stocks/:id`  | Обновление карточки по ID                             |
| `DELETE` | `/stocks/:id`  | Удаление карточки по ID                               |

Данные хранятся в JSON-файле. Проект должен быть структурирован по принципам слоистой архитектуры (Router → Controller → Service).

---

## Цель

Познакомиться с фреймворком Express.js, освоить принципы построения REST API на Node.js с использованием слоистой архитектуры, а также научиться организовывать маршрутизацию, middleware-цепочки и обработку ошибок.

---

## Вариант и референсы

**Вариант:** карточки акций (`Stock`) с полями `id`, `src`, `title`, `text`.

**Использованные технологии и документация:**
- [Express.js](https://expressjs.com/) — веб-фреймворк для Node.js
- [Node.js `fs` module](https://nodejs.org/api/fs.html) — работа с файловой системой
- [Postman](https://www.postman.com/) — тестирование HTTP-запросов
- [nodemon](https://www.npmjs.com/package/nodemon) — автоперезапуск сервера при разработке

---

## Реализация

### Архитектура приложения

Проект построен по **Layered Architecture** (слоистой архитектуре):

```
example-express/
├── src/
│   ├── index.js                  # Точка входа (Server setup)
│   ├── routes/
│   │   └── stocks.js             # Router layer
│   ├── controllers/
│   │   └── stocksController.js   # Controller layer
│   ├── services/
│   │   ├── stocksService.js      # Business logic layer
│   │   └── fileService.js        # Data access layer
│   └── data/
│       └── stocks.json           # Хранилище данных
├── package.json
└── package-lock.json
```

Поток обработки запроса:

```
Request → index.js (Middleware) → Router → Controller → Service → FileService → JSON-файл
```

---

### FileService — слой данных

Инкапсулирует работу с файловой системой. Предоставляет методы `readData` и `writeData`, принимающие путь к файлу в качестве параметра.

```js
// src/services/fileService.js
const fs = require('fs');

const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

module.exports = { readData, writeData };
```

---

### StocksService — слой бизнес-логики

Реализует CRUD-операции над массивом карточек. Поддерживает фильтрацию по полю `title` через query-параметр. Путь к файлу передаётся при инициализации через метод `init`.

```js
// src/services/stocksService.js
const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const stocks = fileService.readData(dataFilePath);
    if (title) {
        return stocks.filter(stock =>
            stock.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return stocks;
};

const findOne = (id) => {
    const stocks = fileService.readData(dataFilePath);
    return stocks.find(stock => stock.id === id);
};

const create = (stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const newId = stocks.length > 0
        ? Math.max(...stocks.map(s => s.id)) + 1
        : 1;

    const newStock = { id: newId, ...stockData };
    stocks.push(newStock);
    fileService.writeData(dataFilePath, stocks);

    return newStock;
};

const update = (id, stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const index = stocks.findIndex(s => s.id === id);

    if (index === -1) return null;

    stocks[index] = { ...stocks[index], ...stockData };
    fileService.writeData(dataFilePath, stocks);

    return stocks[index];
};

const remove = (id) => {
    const stocks = fileService.readData(dataFilePath);
    const filteredStocks = stocks.filter(s => s.id !== id);

    if (filteredStocks.length === stocks.length) return false;

    fileService.writeData(dataFilePath, filteredStocks);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
```

---

### StocksController — слой обработки запросов

Контроллер извлекает параметры из `req`, вызывает соответствующий метод сервиса и формирует HTTP-ответ с правильным статус-кодом.

```js
// src/controllers/stocksController.js
const stocksService = require('../services/stocksService');

const getAllStocks = (req, res) => {
    const { title } = req.query;
    const stocks = stocksService.findAll(title);
    res.json(stocks);
};

const getStockById = (req, res) => {
    const id = parseInt(req.params.id);
    const stock = stocksService.findOne(id);

    if (!stock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(stock);
};

const createStock = (req, res) => {
    const { src, title, text } = req.body;

    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};

const updateStock = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedStock = stocksService.update(id, req.body);

    if (!updatedStock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(updatedStock);
};

const deleteStock = (req, res) => {
    const id = parseInt(req.params.id);
    const success = stocksService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.status(204).send();
};

module.exports = { getAllStocks, getStockById, createStock, updateStock, deleteStock };
```

---

### Routes — маршрутизация

Связывает URL-пути с методами контроллера.

```js
// src/routes/stocks.js
const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');

router.get('/', stocksController.getAllStocks);
router.get('/:id', stocksController.getStockById);
router.post('/', stocksController.createStock);
router.patch('/:id', stocksController.updateStock);
router.delete('/:id', stocksController.deleteStock);

module.exports = router;
```

---

### Entry Point и middleware

`src/index.js` — точка входа. Здесь подключаются middleware, роутеры и глобальные обработчики ошибок.

```js
// src/index.js
const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/stocks.json');
stocksService.init(DATA_FILE_PATH);

// 1. Парсинг JSON-тела запроса
app.use(express.json());

// 2. Логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 3. Подключение роутера
app.use('/stocks', stocksRouter);

// 4. Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// 5. Глобальный error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
```

---

## Тестирование через Postman

### Запуск

```shell
npm run start
```

### GET /stocks — получение всех карточек

### GET /stocks?title=Акция 1 — фильтрация по названию

### POST /stocks — создание карточки

### GET /stocks/:id — получение по ID

### PATCH /stocks/:id — обновление карточки

### DELETE /stocks/:id — удаление карточки

---

## Дополнительные задания на защите

В ходе защиты лабораторной работы были выданы три дополнительных задания, реализованных в рамках уже написанного кода.

---

### Доп. задание 1: Фильтрация по названию через query-параметр

**Задание:** добавить возможность поиска карточек по частичному совпадению поля `title` через query-параметр `?title=`.

Реализовано в методе `findAll` сервиса `stocksService.js`. При наличии параметра массив фильтруется с приведением строк к нижнему регистру для регистронезависимого поиска:

```js
// src/services/stocksService.js
const findAll = (title) => {
    const stocks = fileService.readData(dataFilePath);
    if (title) {
        return stocks.filter(stock =>
            stock.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return stocks;
};
```

Query-параметр извлекается в контроллере из `req.query` и передаётся в сервис:

```js
// src/controllers/stocksController.js
const getAllStocks = (req, res) => {
    const { title } = req.query;
    const stocks = stocksService.findAll(title);
    res.json(stocks);
};
```

---

### Доп. задание 2: Валидация входных данных при создании карточки

**Задание:** реализовать проверку наличия всех обязательных полей (`src`, `title`, `text`) при создании карточки. При отсутствии хотя бы одного поля — вернуть ошибку `400 Bad Request`.

Реализовано в методе `createStock` контроллера:

```js
// src/controllers/stocksController.js
const createStock = (req, res) => {
    const { src, title, text } = req.body;

    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};
```

---

### Доп. задание 3: Логирующий middleware с временной меткой

**Задание:** написать собственный middleware, который логирует каждый входящий запрос — метод, URL и время в формате ISO. Middleware должен корректно передавать управление следующему обработчику.

Реализовано в точке входа `src/index.js` как промежуточная функция, подключённая через `app.use` до маршрутов. Вызов `next()` гарантирует передачу запроса дальше по цепочке:

```js
// src/index.js
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
```

Пример вывода в консоль:

```
[2026-02-07T16:33:15.197Z] GET /stocks
[2026-02-07T16:33:18.236Z] GET /stocks/1
[2026-02-07T16:34:02.541Z] POST /stocks
```
