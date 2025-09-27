// src/modules/transaction/transaction.query.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as svc from './transaction.query.service';

export const getSuspicious = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = Number(req.params.businessid);
    if (!Number.isFinite(businessId)) return res.status(400).json({ message: 'businessid inválido' });

    const data = await svc.getSuspiciousByBusiness(businessId);
    res.json(data);
  } catch (err) { next(err); }
};

export const getLast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = Number(req.params.businessid);
    const customerId = Number(req.params.customerid);
    if (!Number.isFinite(businessId) || !Number.isFinite(customerId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const data = await svc.getLastByCustomer(businessId, customerId);
    res.json(data);
  } catch (err) { next(err); }
};

export const getFrauds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = Number(req.params.businessid);
    const customerId = Number(req.params.customerid);
    if (!Number.isFinite(businessId) || !Number.isFinite(customerId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const data = await svc.getFraudsByCustomer(businessId, customerId);
    res.json(data);
  } catch (err) { next(err); }
};

export const putFraudEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });

    const { observation, result, consequences } = req.body || {};
    const updated = await svc.updateFraudEventById(id, {
      observation,
      result,
      consequences, // ejemplo: "bloqueo_tarjeta||alerta_cliente"
    });

    if (!updated) return res.status(404).json({ message: 'Fraud event no encontrado' });
    res.json({ message: 'Actualizado', event: updated });
  } catch (err) { next(err); }
};
