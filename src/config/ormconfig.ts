import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import * as path from 'path';
import dotenv from 'dotenv';

//dotenv.config();

//console.log('🧭 Cargando entidades desde:', path.join(__dirname, '../modules/**/*.entity.js'));
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

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
   entities: [path.join(__dirname, '../modules/neural-network/neural-network.entity.js')],
});

console.log(
  '✅ Entidades cargadas:',
  AppDataSource.entityMetadatas.map(e => e.name)
);