"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/generate-swagger.ts
const fs_1 = __importDefault(require("fs"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// 📦 Guarda el JSON generado
fs_1.default.writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Swagger JSON generado con éxito.');
