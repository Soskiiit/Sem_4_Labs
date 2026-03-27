const swaggerAutogen = require('swagger-autogen')();

swaggerAutogen('./docs/dogs-api.json', ['./src/routes/dogs.js']);
