const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const dogsRouter = require('./routes/dogs');
const dogsService = require('./services/dogsService');

const app = express();
const PORT = 3000;

// Определяем путь к файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data/dogs.json');

const swaggerDocument = require('../docs/dogs-api.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


if (!fs.existsSync(DATA_FILE_PATH)) {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([]), 'utf8');
}

// Инициализируем сервис с путем к файлу данных
dogsService.init(DATA_FILE_PATH);

// 1. Встроенный middleware для парсинга JSON
// а также CORS для 5 ЛР, ибо статика и бэк висят на разных портах
// UPD: Завтра лаба, не знаю как показывать. Оставляю корс для демки 5, 6 ЛР
app.use(express.json());
app.use(cors())

// Распространяем статику (Кусок 6 ЛР)
app.use(express.static(path.join(__dirname, '/../public')));


// 2. Логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Обязательно вызываем next(), иначе запрос зависнет
});

// 3. Подключение маршрутов
app.use('/dogs', dogsRouter);

// 4. Глобальная обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// 5. Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
