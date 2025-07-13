import { DataSource } from 'typeorm';
import * as path from 'path';
import NeuralNetwork from '../modules/neural-network/neural-network.entity';

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
   entities: [NeuralNetwork],
});

