// src/modules/masterdata/masterdata.service.ts
import Business from './business.model';
import Customer from './customer.model';
import PaymentMethod from './payment-method.model';
import Parameter from './parameter.model';

export async function listBusiness() {
  return Business.findAll({ order: [['id', 'ASC']] });
}

export async function listCustomers() {
  return Customer.findAll({ order: [['id', 'ASC']] });
}

export async function listActivePaymentMethodsByCustomer(customerId: number) {
  return PaymentMethod.findAll({
    where: { customerId, status: 1 },
    order: [['id', 'ASC']],
  });
}

/**
 * Devuelve pares { clave, valor } activos para un 'name'
 * Ej: GET /configs/parameters/TIMEOUTS  ->  [{ clave:"PREDICT_TIMEOUT", valor:"15000" }, ...]
 */
export async function getParametersByName(name: string) {
  const rows = await Parameter.findAll({
    attributes: ['clave', 'valor'],
    where: { name, status: 1 },
    order: [['clave', 'ASC']],
  });
  // map a objeto { clave, valor }
  return rows.map(r => ({ clave: r.clave, valor: r.valor }));
}
