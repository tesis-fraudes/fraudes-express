import { Op } from 'sequelize';
import Role from './role.model';
import User from './user.model';
import UserRole from './user-role.model';

export async function listRoles() {
  return Role.findAll({ order: [['id', 'ASC']] });
}

export type LoginPayload = { email: string; password: string; role_id: number };

export async function login({ email, password, role_id }: LoginPayload) {
  // 1) busca usuario por email y password "plain"
  const user = await User.findOne({
    where: {
      email: { [Op.iLike]: email },  // case-insensitive en email
      password: String(password),    // comparación directa
    },
  });

  if (!user) {
    return { ok: false, message: 'Credenciales inválidas' };
  }

  // 2) valida que el usuario tenga el rol
  const rel = await UserRole.findOne({
    where: { userId: user.id, roleId: Number(role_id) },
  });

  if (!rel) {
    return { ok: false, message: 'Rol no asignado al usuario' };
  }

  return { ok: true, user_id: user.id };
}

export async function getUserById(id: number) {
  // sin password
  return User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Role, through: { attributes: [] } }],
  });
}
