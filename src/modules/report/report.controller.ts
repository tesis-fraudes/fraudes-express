// src/modules/report/report.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as svc from './report.service';

function pickRange(req: Request) {
  const startDate = (req.query.start_date as string) || undefined;
  const endDate = (req.query.end_date as string) || undefined;
  return { startDate, endDate };
}
function pickPage(req: Request) {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;
  return { limit, offset };
}

/* Approveds */
export const getApproveds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await svc.listApproveds(pickRange(req), pickPage(req));
    res.json(data);
  } catch (e) { next(e); }
};
export const exportApproveds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await svc.exportApproveds(pickRange(req));
    res.json(rows);
  } catch (e) { next(e); }
};

/* Rejecteds */
export const getRejecteds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await svc.listRejecteds(pickRange(req), pickPage(req));
    res.json(data);
  } catch (e) { next(e); }
};
export const exportRejecteds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await svc.exportRejecteds(pickRange(req));
    res.json(rows);
  } catch (e) { next(e); }
};

/* Predicted */
export const getPredicted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await svc.listPredicted(pickRange(req), pickPage(req));
    res.json(data);
  } catch (e) { next(e); }
};
export const exportPredicted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await svc.exportPredicted(pickRange(req));
    res.json(rows);
  } catch (e) { next(e); }
};

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = (req.query.start_date as string) || undefined;
    const endDate   = (req.query.end_date as string)   || undefined;
    const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;

    const data = await svc.getOverview({ startDate, endDate }, businessId);
    res.json(data);
  } catch (e) { next(e); }
};