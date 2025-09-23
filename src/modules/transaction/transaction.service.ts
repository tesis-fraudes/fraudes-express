// src/modules/transaction/transaction.service.ts
import axios from 'axios';
import { Transaction as SequelizeTx } from 'sequelize';
import  { sequelize } from '../../config/sequelize'; // export default instance
import Transaction from './transaction.model';
import Prediction from './prediction.model';
import FraudEvent from './fraud-event.model';
import NeuralNetwork from '../neural-network/neural-network.model';

const PREDICT_URL = 'https://vnl7jyouid.execute-api.us-east-1.amazonaws.com/predict';

// thresholds
const APPROVE_LT = 50;
const REJECT_GT  = 90; // > 90 reject; [50..90] => suspicious

type PurchaseInput = {
  business_id: number;
  customer_id: number;
  payment_id: number;
  user_id: number;
  currency?: string;
  transaction_amount: number;
  transaction_hour: number;
  is_proxy: number | boolean;
  distance_home_shipping: number;
  avg_monthly_spend: number;
  previous_frauds: number;
  device_type: string;
  browser: string;
  country_ip: string;
  card_type: string;
  payment_method: string;
  card_country: string;
  business_country: string;
  ip_address?: string;
};

export async function purchase(data: PurchaseInput) {
  // 1) obtener modelo activo
  const active = await NeuralNetwork.findOne({ where: { status: 1 } });
  if (!active) {
    throw new Error('No hay modelo activo para predecir');
  }

  const t = await sequelize.transaction();

  try {
    // 2) crear transacción en estado PENDIENTE (0) para obtener id
    const trx = await Transaction.create({
      businessId: data.business_id,
      customerId: data.customer_id,
      paymentId:  data.payment_id,
      amount:     data.transaction_amount,
      currency:   data.currency ?? 'USD',
      hour:       data.transaction_hour,
      isProxy:    !!Number(data.is_proxy),
      distanceHomeShipping: Math.round(Number(data.distance_home_shipping)),
      avgMonthlySpend: data.avg_monthly_spend,
      previousFrauds: data.previous_frauds,
      deviceType: data.device_type,
      browser:    data.browser,
      countryIp:  data.country_ip,
      ipAddress:  data.ip_address,
      modelId:    active.id,
      status:     0, // pendiente
      createdBy:  data.user_id,
    }, { transaction: t });

    // 3) llamar API de predict (si falla, dejamos la transacción pendiente y salimos)
    let fraudScore: number | null = null;
    let predClass: string | undefined;
    let prediction: number | undefined;
    let fraudProb: number | undefined;

    try {
      const payload = {
        model_key: active.modelKey,             // del modelo activo
        items: [
          {
            // no es necesario enviar transaction_id; lo omitimos
            user_id: data.user_id,              // tu modelo usa int; API acepta string/number
            transaction_amount: data.transaction_amount,
            transaction_hour: data.transaction_hour,
            is_proxy: Number(!!Number(data.is_proxy)),
            distance_home_shipping: data.distance_home_shipping,
            avg_monthly_spend: data.avg_monthly_spend,
            previous_frauds: data.previous_frauds,
            device_type: data.device_type,
            browser: data.browser,
            country_ip: data.country_ip,
            card_type: data.card_type,
            payment_method: data.payment_method,
            card_country: data.card_country,
            business_country: data.business_country,
          },
        ],
      };

      const { data: resp } = await axios.post(PREDICT_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 1000 * 20,
      });

      // adapta a tu respuesta real:
      // esperado algo como { predictions: [{ fraud_score, class, prediction, fraud_probability }] }
      const p0 = resp?.predictions?.[0] ?? resp?.items?.[0] ?? resp ?? {};
      fraudScore = Number(p0.fraud_score ?? p0.score ?? null);
      predClass = p0.class ?? p0.label;
      prediction = typeof p0.prediction === 'number' ? p0.prediction : undefined;
      fraudProb = p0.fraud_probability ?? p0.probability;
    } catch (_apiErr) {
      // API no responde → dejamos trx PENDIENTE (0)
      await t.commit();
      return {
        transaction: trx,
        status: 'PENDING_API',
        message: 'API de predicción no respondió, transacción guardada como pendiente',
      };
    }

    // 4) decidir status por score
    let newStatus = 3; // sospechosa por defecto
    if (fraudScore !== null && !Number.isNaN(fraudScore)) {
      if (fraudScore < APPROVE_LT) newStatus = 1;         // aprobado automáticamente
      else if (fraudScore > REJECT_GT) newStatus = 4;     // rechazado automáticamente
      else newStatus = 3;                                 // sospechosa
    }

    // 5) actualizar transacción con score y status
    await trx.update(
      { fraudScore: fraudScore ?? null, status: newStatus },
      { transaction: t }
    );

    // 6) guardar predicción si hubo respuesta correcta
    await Prediction.create({
      modelId: active.id,
      transactionId: trx.id,
      fraudScore: fraudScore ?? undefined,
      klass: predClass,
      prediction,
      fraudProbability: typeof fraudProb === 'number' ? fraudProb : undefined,
      createdBy: data.user_id,
    }, { transaction: t });

    // 7) eventos de fraude
    if (newStatus === 3) {
      // sospechosa: crear evento vacío (solo id_transaccion)
      await FraudEvent.create({
        transactionId: trx.id,
        userId: data.user_id,
        status: 3,
      }, { transaction: t });
    }
    if (newStatus === 4) {
      // rechazado: crear evento con observación
      await FraudEvent.create({
        transactionId: trx.id,
        userId: data.user_id,
        status: 4,
        observation: `reject> score=${fraudScore}, model_id=${active.id}`,
        result: 'rejected_by_model',
      }, { transaction: t });
    }

    await t.commit();

    return {
      transaction: await Transaction.findByPk(trx.id),
      model: { id: active.id, name: active.modelName, key: active.modelKey },
      decision: newStatus,
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
