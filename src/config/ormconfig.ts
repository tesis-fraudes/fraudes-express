import { DataSource } from 'typeorm';
import { NeuralNetwork } from '../modules/neural-network/neural-network.entity';
import dotenv from 'dotenv';

//dotenv.config();
console.log('CLOUDFLARE_ACCESS_KEY:', process.env.CLOUDFLARE_ACCESS_KEY);
console.log('CLOUDFLARE_SECRET_KEY:', process.env.CLOUDFLARE_SECRET_KEY);
console.log('CLOUDFLARE_S3_ENDPOINT:', process.env.CLOUDFLARE_S3_ENDPOINT);
console.log('CLOUDFLARE_BUCKET_NAME:', process.env.CLOUDFLARE_BUCKET_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('PORT:', process.env.PORT);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // solo para desarrollo
  entities: [NeuralNetwork],
});