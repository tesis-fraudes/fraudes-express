// src/config/sequelize.ts
import { Sequelize } from 'sequelize-typescript';
import NeuralNetwork from '../modules/neural-network/neural-network.model';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  models: [NeuralNetwork],
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
