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

export const getActiveModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const model = await redNeuronalService.getActiveModel();
    if (!model) {
      return res.status(404).json({ message: 'No hay modelo activo' });
    }
    res.json(model);
  } catch (err) {
    next(err);
  }
};

export const activateModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawId =
      (req.body && (req.body.id ?? req.body.modelId)) ??
      (req.query && (req.query.id as string)) ??
      req.params?.id;

    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Falta el id del modelo' });
    }

    const model = await redNeuronalService.activateModel(id);
    if (!model) return res.status(404).json({ message: 'Modelo no encontrado' });

    res.json({ message: 'Modelo activado correctamente', model });
  } catch (err) {
    next(err);
  }
};