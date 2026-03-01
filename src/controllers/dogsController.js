const dogsService = require('../services/dogsService');

const getAllDogs = (req, res) => {
    const { title } = req.query;
    const dogs = dogsService.findAll(title);
    res.json(dogs);
};

const getDogById = (req, res) => {
    const id = parseInt(req.params.id);
    const dog = dogsService.findOne(id);
    
    if (!dog) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    
    res.json(dog);
};

const createDog = (req, res) => {
    const { image_src, title, text, accordionData } = req.body;
    
    // Простая валидация
    if (!image_src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }
    
    const newDog = dogsService.create({ image_src, title, text, accordionData });
    res.status(201).json(newDog);
};

const updateDog = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedDog = dogsService.update(id, req.body);
    
    if (!updatedDog) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    
    res.json(updatedDog);
};

const deleteDog = (req, res) => {
    const id = parseInt(req.params.id);
    const success = dogsService.remove(id);
    
    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    
    res.status(204).send(); // 204 No Content
};

module.exports = {
    getAllDogs,
    getDogById,
    createDog,
    updateDog,
    deleteDog
};
