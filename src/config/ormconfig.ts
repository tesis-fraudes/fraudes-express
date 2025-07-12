import { DataSource } from 'typeorm';
import { NeuralNetwork } from '../modules/neural-network/neural-network.entity';
import dotenv from 'dotenv';
//dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false, // solo para desarrollo
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [NeuralNetwork],
});