import express from 'express';
//import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import { json } from 'body-parser';
import { AppDataSource } from './config/ormconfig';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

import healthRoutes from './modules/health/health.routes';
import neuralNetworkRoutes from './modules/neural-network/neural-network.routes';

//dotenv.config();

const app = express();
app.use(cors());

app.use(json());

//app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const swaggerSpec = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));

app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerUi.setup(undefined, {
  explorer: true,
  swaggerOptions: {
    url: '/docs/swagger.json',
  },
}));

app.get('/docs/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// rutas
app.use('/health', healthRoutes);
app.use('/neural-network', neuralNetworkRoutes);

// inicializar base de datos
let isDbInitialized = false;

if (!isDbInitialized) {
  AppDataSource.initialize()
    .then(() => {
      console.log('🟢 Database connected');
      isDbInitialized = true;
    })
    .catch((err) => console.error('🔴 Database error:', err));
}


export default app;
