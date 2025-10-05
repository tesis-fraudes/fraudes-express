import { Op, fn, col, where as sqWhere } from 'sequelize';
import Role from './role.model';
import User from './user.model';
import UserRole from './user-role.model';

export async function listRoles() {
  return Role.findAll({ order: [['id', 'ASC']] });
}

export type LoginPayload = { email: string; password: string; role_id: number };

export async function login({ email, password, role_id }: { email: string; password: string; role_id: number }) {
  const emailNorm = String(email).trim().toLowerCase();

  try {
    const user = await User.findOne({
      where: {
        email: emailNorm,               
        password: String(password),     
      },
    });

    if (!user) return { ok: false, message: 'Credenciales inválidas' };

    const rel = await UserRole.findOne({
      where: { userId: user.id, roleId: Number(role_id) },
    });

    if (!rel) return { ok: false, message: 'Rol no asignado al usuario' };

    return { ok: true, user_id: user.id };
  } catch (err: any) {
    // log útil si vuelve a fallar
    const p = err?.parent || err?.original || {};
    console.error('AUTH LOGIN PG CODE:', p.code);
    console.error('AUTH LOGIN PG MSG:', p.message);
    console.error('AUTH LOGIN PG DETAIL:', p.detail);
    throw err;
  }
}

export async function getUserById(id: number) {
  // sin password
  return User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Role, through: { attributes: [] } }],
  });
}
