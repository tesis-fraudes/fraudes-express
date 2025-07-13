"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log('DB:', {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
    });
    console.log(`🚀 Servidor corriendo en puerto 1555 ${PORT}`);
});
//new ports example
