// src/modules/report/report.routes.ts
import { Router } from 'express';
import {
  getApproveds, exportApproveds,
  getRejecteds, exportRejecteds,
  getPredicted, exportPredicted,
  getOverview,
} from './report.controller';

const router = Router();

router.get('/report/transactions/approveds', getApproveds);
router.get('/report/transactions/approveds/export', exportApproveds);

router.get('/report/transactions/rejecteds', getRejecteds);
router.get('/report/transactions/rejecteds/export', exportRejecteds);

router.get('/report/predicted', getPredicted);
router.get('/report/predicted/export', exportPredicted);

router.get('/report/overview', getOverview);

export default router;
