import { DataSource } from 'typeorm';
import { NeuralNetwork } from '../modules/neural-network/neural-network.entity';
import dotenv from 'dotenv';

//dotenv.config();
console.log('CLOUDFLARE_ACCESS_KEY:', process.env.CLOUDFLARE_ACCESS_KEY);
console.log('CLOUDFLARE_SECRET_KEY:', process.env.CLOUDFLARE_SECRET_KEY);
console.log('CLOUDFLARE_S3_ENDPOINT:', process.env.CLOUDFLARE_S3_ENDPOINT);
console.log('CLOUDFLARE_BUCKET_NAME:', process.env.CLOUDFLARE_BUCKET_NAME);
console.log('DB_HOST:', process.env.PGHOST);
console.log('DB_PORT:', process.env.PGPORT);
console.log('PORT:', process.env.PORT);
console.log('🚨 TODAS LAS ENV DISPONIBLES:', JSON.stringify(process.env, null, 2));

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false, // solo para desarrollo
  entities: [NeuralNetwork],
});