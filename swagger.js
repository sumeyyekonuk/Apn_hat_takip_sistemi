const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APN Hat Takip Sistemi API',
      version: '1.0.0',
      description: 'APN Hat Takip Sistemi için REST API dokümantasyonu'
    },
    servers: [
      { url: 'http://localhost:5000' }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };