// scripts/generate-swagger.ts
import fs from 'fs';
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
  ],
};

const options = {
  swaggerDefinition,
  apis: ['src/modules/**/*.ts'], // ✅ Usa los archivos fuente
};

const swaggerSpec = swaggerJSDoc(options);

// 📦 Guarda el JSON generado
fs.writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Swagger JSON generado con éxito.');