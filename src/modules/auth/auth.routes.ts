import { Router } from 'express';
import { getRoles, postLogin, postUserById } from './auth.controller';

const router = Router();

router.get('/auth/roles', getRoles);
router.post('/auth/login', postLogin);
// según tu requerimiento será POST (aunque semánticamente sería GET)
router.post('/auth/user/:id', postUserById);

export default router;
