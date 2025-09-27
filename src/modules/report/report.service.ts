// src/modules/report/report.service.ts
import { QueryTypes } from 'sequelize';
import {sequelize} from '../../config/sequelize';

type DateRange = { startDate?: string; endDate?: string };
type Page = { limit?: number; offset?: number };

function normalizeDates({ startDate, endDate }: DateRange) {
  // Si no envían fechas, trae todo; para "endDate" inclusivo uso end+1 día (BETWEEN-cerrado)
  const start = startDate ? new Date(startDate) : new Date('1970-01-01');
  const end = endDate ? new Date(endDate) : new Date('2999-12-31');
  // endPlus = end + 1 día (para comparar con < endPlus)
  const endPlus = new Date(end.getTime() + 24 * 3600 * 1000);
  return { startISO: start.toISOString(), endPlusISO: endPlus.toISOString() };
}

function normalizePage({ limit, offset }: Page) {
  const l = Number.isFinite(limit as number) ? Math.min(Number(limit), 500) : 50;
  const o = Number.isFinite(offset as number) ? Number(offset) : 0;
  return { limit: l, offset: o };
}

/* ---------------------- APROBADAS (status 1 y 2) ---------------------- */

export async function listApproveds(range: DateRange, page: Page) {
  const { startISO, endPlusISO } = normalizeDates(range);
  const { limit, offset } = normalizePage(page);

  const sql = `
    SELECT
      t.id AS transaction_id,
      t.created_at,
      t.amount, t.currency, t.fraud_score, t.status,
      t.business_id, b.company_name, b.trade_name,
      t.customer_id, c.name AS customer_name,
      t.payment_id, pm.type_payment, pm.provider,
      t.model_id, nn.name AS model_name
    FROM tbl_transactions t
    LEFT JOIN tbl_business b ON b.id = t.business_id
    LEFT JOIN tbl_customers c ON c.id = t.customer_id
    LEFT JOIN tbl_payment_methods pm ON pm.id = t.payment_id
    LEFT JOIN tbl_neuralnetwork nn ON nn.id = t.model_id
    WHERE t.status IN (1,2)
      AND t.created_at >= :start
      AND t.created_at < :endPlus
    ORDER BY t.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { start: startISO, endPlus: endPlusISO, limit, offset },
  });

  return { items: rows, meta: { limit, offset } };
}

export async function exportApproveds(range: DateRange) {
  const { startISO, endPlusISO } = normalizeDates(range);

  const sql = `
    SELECT
      t.id AS transaction_id,
      t.created_at,
      t.amount, t.currency, t.fraud_score, t.status,
      t.business_id, b.company_name, b.trade_name,
      t.customer_id, c.name AS customer_name,
      t.payment_id, pm.type_payment, pm.provider,
      t.model_id, nn.name AS model_name
    FROM tbl_transactions t
    LEFT JOIN tbl_business b ON b.id = t.business_id
    LEFT JOIN tbl_customers c ON c.id = t.customer_id
    LEFT JOIN tbl_payment_methods pm ON pm.id = t.payment_id
    LEFT JOIN tbl_neuralnetwork nn ON nn.id = t.model_id
    WHERE t.status IN (1,2)
      AND t.created_at >= :start
      AND t.created_at < :endPlus
    ORDER BY t.created_at DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { start: startISO, endPlus: endPlusISO },
  });
}

/* ---------------------- RECHAZADAS (status 4 y 5) ---------------------- */

export async function listRejecteds(range: DateRange, page: Page) {
  const { startISO, endPlusISO } = normalizeDates(range);
  const { limit, offset } = normalizePage(page);

  const sql = `
    SELECT
      t.id AS transaction_id,
      t.created_at,
      t.amount, t.currency, t.fraud_score, t.status,
      t.business_id, b.company_name, b.trade_name,
      t.customer_id, c.name AS customer_name,
      t.payment_id, pm.type_payment, pm.provider,
      t.model_id, nn.name AS model_name
    FROM tbl_transactions t
    LEFT JOIN tbl_business b ON b.id = t.business_id
    LEFT JOIN tbl_customers c ON c.id = t.customer_id
    LEFT JOIN tbl_payment_methods pm ON pm.id = t.payment_id
    LEFT JOIN tbl_neuralnetwork nn ON nn.id = t.model_id
    WHERE t.status IN (4,5)
      AND t.created_at >= :start
      AND t.created_at < :endPlus
    ORDER BY t.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { start: startISO, endPlus: endPlusISO, limit, offset },
  });

  return { items: rows, meta: { limit, offset} };
}

export async function exportRejecteds(range: DateRange) {
  const { startISO, endPlusISO } = normalizeDates(range);

  const sql = `
    SELECT
      t.id AS transaction_id,
      t.created_at,
      t.amount, t.currency, t.fraud_score, t.status,
      t.business_id, b.company_name, b.trade_name,
      t.customer_id, c.name AS customer_name,
      t.payment_id, pm.type_payment, pm.provider,
      t.model_id, nn.name AS model_name
    FROM tbl_transactions t
    LEFT JOIN tbl_business b ON b.id = t.business_id
    LEFT JOIN tbl_customers c ON c.id = t.customer_id
    LEFT JOIN tbl_payment_methods pm ON pm.id = t.payment_id
    LEFT JOIN tbl_neuralnetwork nn ON nn.id = t.model_id
    WHERE t.status IN (4,5)
      AND t.created_at >= :start
      AND t.created_at < :endPlus
    ORDER BY t.created_at DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { start: startISO, endPlus: endPlusISO },
  });
}

/* ---------------------- PREDICCIONES (tbl_predictions) ---------------------- */

export async function listPredicted(range: DateRange, page: Page) {
  const { startISO, endPlusISO } = normalizeDates(range);
  const { limit, offset } = normalizePage(page);

  const sql = `
    SELECT
      p.id AS prediction_id,
      p.created_at,
      p.fraud_score, p.class, p.prediction, p.fraud_probability,
      p.model_id, nn.name AS model_name,
      t.id AS transaction_id, t.amount, t.currency, t.fraud_score AS transaction_fraud_score,
      t.business_id, b.company_name, b.trade_name,
      t.customer_id, c.name AS customer_name
    FROM tbl_predictions p
    JOIN tbl_transactions t ON t.id = p.transaction_id
    LEFT JOIN tbl_neuralnetwork nn ON nn.id = p.model_id
    LEFT JOIN tbl_business b ON b.id = t.business_id
    LEFT JOIN tbl_customers c ON c.id = t.customer_id
    WHERE p.created_at >= :start AND p.created_at < :endPlus
    ORDER BY p.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { start: startISO, endPlus: endPlusISO, limit, offset },
  });

  return { items: rows, meta: { limit, offset } };
}

export async function exportPredicted(range: DateRange) {
  const { startISO, endPlusISO } = normalizeDates(range);

  const sql = `
    SELECT
      p.id AS prediction_id,
      p.created_at,
      p.fraud_score, p.class, p.prediction, p.fraud_probability,
      p.model_id, nn.name AS model_name,
      t.id AS transaction_id, t.amount, t.currency, t.fraud_score AS transaction_fraud_score,
      t.business_id, b.company_name, b.trade_name,
      t.customer_id, c.name AS customer_name
    FROM tbl_predictions p
    JOIN tbl_transactions t ON t.id = p.transaction_id
    LEFT JOIN tbl_neuralnetwork nn ON nn.id = p.model_id
    LEFT JOIN tbl_business b ON b.id = t.business_id
    LEFT JOIN tbl_customers c ON c.id = t.customer_id
    WHERE p.created_at >= :start AND p.created_at < :endPlus
    ORDER BY p.created_at DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { start: startISO, endPlus: endPlusISO },
  });
}
