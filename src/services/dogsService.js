const fileService = require('./fileService');

// Переменная для хранения пути к файлу данных, будет установлена при инициализации
let dataFilePath;

// Функция инициализации сервиса с путем к файлу данных
const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const dogs = fileService.readData(dataFilePath);
    if (title) {
        return dogs.filter(dog => 
            dog.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return dogs;
};

const findOne = (id) => {
    const dogs = fileService.readData(dataFilePath);
    return dogs.find(dog => dog.id === id);
};

const create = (dogData) => {
    const dogs = fileService.readData(dataFilePath);
    
    // Генерация ID: берем максимальный ID + 1
    const newId = dogs.length > 0 
        ? Math.max(...dogs.map(d => d.id)) + 1 
        : 1;
        
    const newDog = { id: newId, ...dogData };
    dogs.push(newDog);
    fileService.writeData(dataFilePath, dogs);
    
    return newDog;
};

const update = (id, dogData) => {
    const dogs = fileService.readData(dataFilePath);
    const index = dogs.findIndex(d => d.id === id);
    
    if (index === -1) return null;
    
    dogs[index] = { ...dogs[index], ...dogData };
    fileService.writeData(dataFilePath, dogs);
    
    return dogs[index];
};

const remove = (id) => {
    const dogs = fileService.readData(dataFilePath);
    const filteredDogs = dogs.filter(d => d.id !== id);
    
    if (filteredDogs.length === dogs.length) {
        return false; // Ничего не удалили
    }
    
    fileService.writeData(dataFilePath, filteredDogs);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
