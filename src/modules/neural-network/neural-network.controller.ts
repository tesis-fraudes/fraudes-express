import { Request, Response } from 'express';
import redNeuronalService from './neural-network.service';

export const uploadFile = async (req: Request, res: Response) => {
  const file = req.file;
  const { modelo, version, accuracy, status } = req.body;

  if (!file || !modelo || !version || !accuracy || !status) {
    return res.status(400).json({ error: 'Faltan campos requeridos o archivo' });
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
    res.status(500).json({ error: 'Error al procesar el archivo' });
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

export const getModelById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const model = await redNeuronalService.getById(id);
    if (!model) {
      return res.status(404).json({ error: 'Modelo no encontrado' });
    }

    res.json(model);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener modelo' });
  }
};