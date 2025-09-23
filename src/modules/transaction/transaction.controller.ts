// src/modules/transaction/transaction.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from './transaction.service';

export const purchase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // saca IP de headers (ALB / API Gateway) o socket
    const xf = (req.headers['x-forwarded-for'] as string) || '';
    const clientIp =
      (xf.split(',')[0] || '').trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket?.remoteAddress ||
      '0.0.0.0';
    const body = req.body || {};

    // validaciones mínimas
    const must = ['business_id','customer_id','payment_id','user_id','transaction_amount','transaction_hour'];
    const missing = must.filter(k => body[k] === undefined || body[k] === null || body[k] === '');
    if (missing.length) {
      return res.status(400).json({ message: 'Faltan campos requeridos', missing });
    }

    const result = await service.purchase({
      business_id: Number(body.business_id),
      customer_id: Number(body.customer_id),
      payment_id: Number(body.payment_id),
      user_id: Number(body.user_id),
      currency: body.currency,
      transaction_amount: Number(body.transaction_amount),
      transaction_hour: Number(body.transaction_hour),
      is_proxy: Number(body.is_proxy ?? 0),
      distance_home_shipping: Number(body.distance_home_shipping ?? 0),
      avg_monthly_spend: Number(body.avg_monthly_spend ?? 0),
      previous_frauds: Number(body.previous_frauds ?? 0),
      device_type: String(body.device_type || ''),
      browser: String(body.browser || ''),
      country_ip: String(body.country_ip || ''),
      card_type: String(body.card_type || ''),
      payment_method: String(body.payment_method || ''),
      card_country: String(body.card_country || ''),
      business_country: String(body.business_country || ''),
      ip_address: clientIp,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
