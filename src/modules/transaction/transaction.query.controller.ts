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
    //const businessId = Number(req.params.businessid);
    const customerId = Number(req.params.customerid);
    if (!Number.isFinite(customerId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const data = await svc.getLastByCustomer(customerId);
    res.json(data);
  } catch (err) { next(err); }
};

export const getFrauds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //const businessId = Number(req.params.businessid);
    const customerId = Number(req.params.customerid);
    if (!Number.isFinite(customerId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const data = await svc.getFraudsByCustomer(customerId);
    res.json(data);
  } catch (err) { next(err); }
};

export const putFraudEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });

    const { action, observation, result, consequences } = req.body || {};
    if (!action) return res.status(400).json({ message: 'Falta "action" (approve|reject)' });

    const updated = await svc.resolveFraudEventById(id, {
      action,
      observation,
      result,
      consequences, // ejemplo: "bloqueo_tarjeta||alerta_cliente"
    });

    if (!updated) return res.status(404).json({ message: 'Fraud event no encontrado' });
    res.json({ message: 'Actualizado', event: updated });
  } catch (err) { next(err); }
};

export const postSuspiciousSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { business_id = 0, customer_id = 0, transaction_id = 0 } = req.body || {};
    const data = await svc.searchSuspicious({
      business_id: Number(business_id),
      customer_id: Number(customer_id),
      transaction_id: Number(transaction_id),
    });
    res.json(data);
  } catch (err) { next(err); }
};


