"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const neural_network_controller_1 = require("./neural-network.controller");
const router = (0, express_1.Router)();
// ✅ Usar /tmp para almacenamiento temporal en AWS Lambda / test
const tempUploadDir = '/tmp/uploads';
// ✅ Crear el directorio si no existe
if (!fs_1.default.existsSync(tempUploadDir)) {
    fs_1.default.mkdirSync(tempUploadDir, { recursive: true });
}
// ✅ Configurar multer para guardar en /tmp/uploads
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, tempUploadDir);
    },
    filename: function (_req, file, cb) {
        // Mantener el nombre original o puedes renombrar si prefieres
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage }); // temporalmente en local
/**
 * @openapi
 * /neural-network/uploads:
 *   post:
 *     summary: Sube y guarda un modelo de red neuronal
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - modelo
 *               - version
 *               - accuracy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               modelo:
 *                 type: string
 *               version:
 *                 type: string
 *               accuracy:
 *                 type: number
 *     responses:
 *       201:
 *         description: Modelo guardado exitosamente
 */
router.post('/upload', upload.single('file'), neural_network_controller_1.uploadFile);
// GET /neural-network
/**
 * @openapi
 * /neural-network:
 *   get:
 *     summary: Lista todos los modelos de red neuronal
 *     responses:
 *       200:
 *         description: Lista de modelos
 */
router.get('/', neural_network_controller_1.getAllModels);
/**
 * @openapi
 * /neural-network/{id}:
 *   get:
 *     summary: Obtiene un modelo por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del modelo
 *     responses:
 *       200:
 *         description: Modelo encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', neural_network_controller_1.getModelById);
exports.default = router;
