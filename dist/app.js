"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { swaggerSpec } from './config/swagger';
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const body_parser_1 = require("body-parser");
const ormconfig_1 = require("./config/ormconfig");
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const neural_network_routes_1 = __importDefault(require("./modules/neural-network/neural-network.routes"));
//dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
//app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const swaggerSpec = JSON.parse(fs_1.default.readFileSync('./swagger.json', 'utf8'));
app.use('/docs', swagger_ui_express_1.default.serve);
app.get('/docs', swagger_ui_express_1.default.setup(undefined, {
    explorer: true,
    swaggerOptions: {
        url: '/docs/swagger.json',
    },
}));
app.get('/docs/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
// rutas
app.use('/health', health_routes_1.default);
app.use('/neural-network', neural_network_routes_1.default);
// inicializar base de datos
let isDbInitialized = false;
if (!isDbInitialized) {
    ormconfig_1.AppDataSource.initialize()
        .then(() => {
        console.log('🟢 Database connected');
        isDbInitialized = true;
    })
        .catch((err) => console.error('🔴 Database error:', err));
}
exports.default = app;
