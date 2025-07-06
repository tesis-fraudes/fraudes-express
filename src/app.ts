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
console.log('CLOUDFLARE_ACCESS_KEY:', process.env.CLOUDFLARE_ACCESS_KEY);
console.log('CLOUDFLARE_SECRET_KEY:', process.env.CLOUDFLARE_SECRET_KEY);
console.log('CLOUDFLARE_S3_ENDPOINT:', process.env.CLOUDFLARE_S3_ENDPOINT);
console.log('CLOUDFLARE_BUCKET_NAME:', process.env.CLOUDFLARE_BUCKET_NAME);
console.log('DB_HOST:', process.env.PGHOST);
console.log('DB_PORT:', process.env.PGPORT);
console.log('PORT:', process.env.PORT);
console.log('🚨 TODAS LAS ENV DISPONIBLES:', JSON.stringify(process.env, null, 2));

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
