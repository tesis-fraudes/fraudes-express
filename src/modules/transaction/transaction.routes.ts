// src/modules/transaction/transaction.routes.ts
import { Router } from 'express';
import { purchase } from './transaction.controller';

const router = Router();

router.post('/purchase', purchase);

export default router;
