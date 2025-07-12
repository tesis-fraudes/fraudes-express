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
      url: 'https://fd6bat803l.execute-api.us-east-1.amazonaws.com',
      description: 'Servidor de producción',
    },
  ]
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['dist/modules/**/*.js'], // <- escanea tus módulos para los comentarios JSDoc
});
