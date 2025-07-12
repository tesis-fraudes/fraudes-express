import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧭 Cargando entidades desde:', path.join(__dirname, '../modules/**/*.entity.js'));

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  // 👇 Carga dinámica compatible con Lambda/Docker
  entities: [path.join(__dirname, '../modules/**/*.entity.js')],
});
