import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Predicción de Fraudes',
    version: '1.0.0',
    description: 'Documentación de la API para gestión de modelos de predicción de fraudes',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['src/modules/**/*.ts'], // <- escanea tus módulos para los comentarios JSDoc
});
