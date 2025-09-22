import { Request, Response, NextFunction } from 'express';
import redNeuronalService from './neural-network.service';


export const train = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file; // multer.single('file')
    const { modelName, userCode } = req.body;

    if (!file) return next(new Error('Falta archivo CSV (campo "file")'));
    if (!modelName) return next(new Error('Falta "modelName"'));
    if (!userCode) return next(new Error('Falta "userCode"'));

    const result = await redNeuronalService.train({
      filePath: file.path,
      modelName,
      userCode,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const file = req.file;
  const { modelo, version, accuracy, status } = req.body;

  if (!file || !modelo || !version || !accuracy || !status) {
    const error = new Error('Faltan campos requeridos o archivo');
    return next(error);
  }

  try {
    const result = await redNeuronalService.procesarYGuardar({
      file,
      modelo,
      version,
      accuracy: accuracy,
      status,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    //res.status(500).json({ error: 'Error al procesar el archivo' });
    next(error);
  }
};

export const getAllModels = async (req: Request, res: Response) => {
  try {
    const result = await redNeuronalService.getAll();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener modelos' });
  }
};

export const getModelById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    const error = new Error('ID inválido');
    return next(error);
  }

  try {
    const model = await redNeuronalService.getById(id);
    if (!model) {
      const error = new Error('Modelo no encontrado');
      return next(error);
    }

    res.json(model);
  } catch (err) {
    console.error(err);
    next(err);
  }
};