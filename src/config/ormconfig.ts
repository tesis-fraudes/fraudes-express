import { DataSource } from 'typeorm';
import { NeuralNetwork } from '../modules/neural-network/neural-network.entity';
import dotenv from 'dotenv';

dotenv.config();

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