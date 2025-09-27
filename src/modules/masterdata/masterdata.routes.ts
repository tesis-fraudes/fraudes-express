// src/modules/masterdata/masterdata.routes.ts
import { Router } from 'express';
import {
  getBusiness,
  getCustomers,
  getCustomerActivePaymentMethods,
  getParameters,
} from './masterdata.controller';

const router = Router();

// /business/
router.get('/business', getBusiness);

// /customers/
router.get('/customers', getCustomers);

// /customers/:id/payment_methods/active
router.get('/customers/:id/payment_methods/active', getCustomerActivePaymentMethods);

// /configs/parameters/:name
router.get('/configs/parameters/:name', getParameters);

export default router;
