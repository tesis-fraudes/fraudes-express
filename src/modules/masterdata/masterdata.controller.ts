// src/modules/masterdata/masterdata.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as svc from './masterdata.service';

export const getBusiness = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await svc.listBusiness();
    res.json(data);
  } catch (err) { next(err); }
};

export const getCustomers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await svc.listCustomers();
    res.json(data);
  } catch (err) { next(err); }
};

export const getCustomerActivePaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });

    const data = await svc.listActivePaymentMethodsByCustomer(id);
    res.json(data);
  } catch (err) { next(err); }
};

export const getParameters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = String(req.params.name || '').trim();
    if (!name) return res.status(400).json({ message: 'Parámetro "name" requerido' });

    const data = await svc.getParametersByName(name);
    res.json(data);
  } catch (err) { next(err); }
};
