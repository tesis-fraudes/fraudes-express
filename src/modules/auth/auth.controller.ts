import { Request, Response, NextFunction } from 'express';
import * as svc from './auth.service';

export const getRoles = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await svc.listRoles();
    res.json(rows);
  } catch (e) { next(e); }
};

export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role_id } = req.body || {};
    if (!email || !password || !role_id) {
      return res.status(400).json({ message: 'Faltan campos: email, password, role_id' });
    }
    const result = await svc.login({ email: String(email), password: String(password), role_id: Number(role_id) });
    if (!result.ok) return res.status(401).json(result);
    res.json(result);
  } catch (e) { next(e); }
};

export const postUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });

    const user = await svc.getUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (e) { next(e); }
};
