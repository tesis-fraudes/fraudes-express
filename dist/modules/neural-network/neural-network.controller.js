"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelById = exports.getAllModels = exports.uploadFile = void 0;
const neural_network_service_1 = __importDefault(require("./neural-network.service"));
const uploadFile = async (req, res, next) => {
    const file = req.file;
    const { modelo, version, accuracy, status } = req.body;
    if (!file || !modelo || !version || !accuracy || !status) {
        const error = new Error('Faltan campos requeridos o archivo');
        return next(error);
    }
    try {
        const result = await neural_network_service_1.default.procesarYGuardar({
            file,
            modelo,
            version,
            accuracy: accuracy,
            status,
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Error al procesar el archivo' });
        next(error);
    }
};
exports.uploadFile = uploadFile;
const getAllModels = async (req, res) => {
    try {
        const result = await neural_network_service_1.default.getAll();
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener modelos' });
    }
};
exports.getAllModels = getAllModels;
const getModelById = async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        const error = new Error('ID inválido');
        return next(error);
    }
    try {
        const model = await neural_network_service_1.default.getById(id);
        if (!model) {
            const error = new Error('Modelo no encontrado');
            return next(error);
        }
        res.json(model);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.getModelById = getModelById;
