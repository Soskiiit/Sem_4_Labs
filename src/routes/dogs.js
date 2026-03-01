const express = require('express');
const router = express.Router();
const dogsController = require('../controllers/dogsController');

// Определение маршрутов
router.get('/', dogsController.getAllDogs);
router.get('/:id', dogsController.getDogById);
router.post('/', dogsController.createDog);
router.patch('/:id', dogsController.updateDog);
router.delete('/:id', dogsController.deleteDog);

module.exports = router;
