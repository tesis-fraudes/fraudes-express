import { Request, Response } from 'express';
import healthService from './health.service';

export const getHealth = async (req: Request, res: Response) => {
  const status = await healthService.check();
  res.status(200).json(status);
};