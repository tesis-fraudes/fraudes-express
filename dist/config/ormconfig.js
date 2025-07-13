"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const neural_network_entity_1 = require("../modules/neural-network/neural-network.entity");
//dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
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
    entities: [neural_network_entity_1.NeuralNetwork],
});
