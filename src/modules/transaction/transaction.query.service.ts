// src/modules/transaction/transaction.query.service.ts
import { Op, literal } from 'sequelize';
import Transaction from './transaction.model';
import FraudEvent from './fraud-event.model';

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
