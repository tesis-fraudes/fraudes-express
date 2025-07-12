import { Router } from 'express';
import multer from 'multer';
import { uploadFile,getAllModels,getModelById } from './neural-network.controller';

const router = Router();

const upload = multer({ dest: 'uploads/' }); // temporalmente en local

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
router.post('/upload', upload.single('file'), uploadFile);

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
router.get('/', getAllModels);

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
router.get('/:id', getModelById);


export default router;
