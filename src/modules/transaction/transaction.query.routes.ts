// src/modules/transaction/transaction.query.routes.ts
import { Router } from 'express';
import { getSuspicious, getLast, getFrauds, putFraudEvent, postSuspiciousSearch } from './transaction.query.controller';

const router = Router();

// GET /transaction/:businessid/suspicious
router.get('/transaction/:businessid/suspicious', getSuspicious);

// GET /transaction/:businessid/:customerid/last
router.get('/transaction/:customerid/last', getLast);

// GET /transaction/:businessid/:customerid/frauds
router.get('/transaction/:businessid/:customerid/frauds', getFrauds);

// PUT /transaction/fraud_event/:id
router.put('/transaction/fraud_event/:id', putFraudEvent);

router.post('/transaction/suspicious/search', postSuspiciousSearch);

export default router;
