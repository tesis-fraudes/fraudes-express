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

  const user = await User.findOne({
    where: {
      password: String(password),                         // comparación simple (demo)
      [Op.and]: [
        // lower(email) = 'correo@dominio'
        sqWhere(fn('lower', col('email')), emailNorm),
      ],
    },
  });

  if (!user) return { ok: false, message: 'Credenciales inválidas' };

  const rel = await UserRole.findOne({ where: { userId: user.id, roleId: Number(role_id) } });
  if (!rel) return { ok: false, message: 'Rol no asignado al usuario' };

  return { ok: true, user_id: user.id };
}

export async function getUserById(id: number) {
  // sin password
  return User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Role, through: { attributes: [] } }],
  });
}
