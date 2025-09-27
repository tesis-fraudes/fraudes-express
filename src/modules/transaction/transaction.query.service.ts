// src/modules/transaction/transaction.query.service.ts
import { Op, literal } from 'sequelize';
import {sequelize} from '../../config/sequelize';
import Transaction from './transaction.model';
import FraudEvent from './fraud-event.model';

type ResolvePayload = {
  action: 'approve' | 'reject';
  observation?: string;
  result?: string;
  consequences?: string; // "a||b||c"
  userId?: number;       // opcional si quieres auditar
};

export async function getSuspiciousByBusiness(businessId: number) {
  // status = 3 (sospechosa) e incluir el último fraude (si existe)
  const rows = await Transaction.findAll({
    where: { businessId, status: 3 },
    include: [
      {
        model: FraudEvent,
        as: 'fraudEvents',
        attributes: ['id'],
        required: false,
        separate: true,
        order: [['createdAt', 'DESC']],
        limit: 1,
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  // aplanar: exponer fraud_event_id directamente
  return rows.map(r => ({
    ...r.toJSON(),
    fraud_event_id: r.fraudEvents?.[0]?.id ?? null,
    fraudEvents: undefined,
  }));
}

export async function getLastByCustomer(businessId: number, customerId: number) {
  const rows = await Transaction.findAll({
    where: { businessId, customerId },
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  const total = rows.reduce((acc, t) => acc + (t.amount ?? 0), 0);
  const average_amount = rows.length ? Number((total / rows.length).toFixed(2)) : 0;

  return { average_amount, items: rows };
}

export async function getFraudsByCustomer(businessId: number, customerId: number) {
  return Transaction.findAll({
    where: {
      businessId,
      customerId,
      status: { [Op.in]: [4, 5] }, // 4 = rechazado auto, 5 = rechazado manual (según tu definición)
    },
    order: [['createdAt', 'DESC']],
  });
}

export async function updateFraudEventById(id: number, data: {
  observation?: string;
  result?: string;
  consequences?: string; // texto con '||'
}) {
  const ev = await FraudEvent.findByPk(id);
  if (!ev) return null;

  await ev.update({
    observation: data.observation ?? ev.observation ?? null,
    result: data.result ?? ev.result ?? null,
    consequences: data.consequences ?? ev.consequences ?? null,
    status: 2, // actualizado / en revisión resuelta (según tu flujo)
  });

  return ev;
}

export async function resolveFraudEventById(id: number, payload: ResolvePayload) {
  const t = await sequelize.transaction();
  try {
    const ev = await FraudEvent.findByPk(id, { transaction: t });
    if (!ev) {
      await t.rollback();
      return null;
    }

    const trx = await Transaction.findByPk(ev.transactionId, { transaction: t });
    if (!trx) {
      await t.rollback();
      throw new Error('Transacción asociada no encontrada');
    }

    const act = payload.action;
    if (act !== 'approve' && act !== 'reject') {
      await t.rollback();
      throw new Error('action inválida (use "approve" o "reject")');
    }

    // Normaliza consecuencias "a||b||c"
    const consequences =
      (payload.consequences ?? ev.consequences ?? '')
        .split('||')
        .map(s => s.trim())
        .filter(Boolean)
        .join('||') || null;

    // Defaults para result
    const defaultResult = act === 'approve' ? 'approved_manual' : 'rejected_manual';

    // 1) Actualiza evento de fraude (status=2 resuelto)
    await ev.update(
      {
        observation: payload.observation ?? ev.observation ?? null,
        result: payload.result ?? ev.result ?? defaultResult,
        consequences,
        status: 2,
      },
      { transaction: t }
    );

    // 2) Actualiza estado de la transacción
    const newStatus = act === 'approve' ? 2 : 5; // 2=aprobado manual, 5=rechazado manual
    await trx.update({ status: newStatus }, { transaction: t });

    await t.commit();
    return { event: ev, transaction: trx };
  } catch (err) {
    try { await t.rollback(); } catch {}
    throw err;
  }
}
