"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const health_service_1 = __importDefault(require("./health.service"));
const getHealth = async (req, res) => {
    const status = await health_service_1.default.check();
    res.status(200).json(status);
};
exports.getHealth = getHealth;
