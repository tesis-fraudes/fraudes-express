import express from 'express';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import { json } from 'body-parser';
import { AppDataSource } from './config/ormconfig';
import dotenv from 'dotenv';

import healthRoutes from './modules/health/health.routes';
import neuralNetworkRoutes from './modules/neural-network/neural-network.routes';

//dotenv.config();

const app = express();
app.use(json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// rutas
app.use('/health', healthRoutes);
app.use('/neural-network', neuralNetworkRoutes);

// inicializar base de datos
AppDataSource.initialize()
  .then(() => console.log('🟢 Database connected'))
  .catch((err) => console.error('🔴 Database error:', err));

export default app;
