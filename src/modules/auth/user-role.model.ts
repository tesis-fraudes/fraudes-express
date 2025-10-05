import { Table, Column, Model, DataType, ForeignKey, CreatedAt, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import User from './user.model';
import Role from './role.model';

export interface UserRoleAttrs {
  id: number;
  userId: number;
  roleId: number;
  createdBy: number | null;
  createdAt?: Date;
}
export type UserRoleCreationAttrs = Optional<UserRoleAttrs, 'id'|'createdBy'|'createdAt'>;

@Table({ tableName: 'tbl_users_roles', timestamps: false })
export default class UserRole extends Model<UserRoleAttrs, UserRoleCreationAttrs> implements UserRoleAttrs {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;

  @ForeignKey(() => User) @Column({ field: 'user_id', type: DataType.INTEGER }) userId!: number;
  @ForeignKey(() => Role) @Column({ field: 'role_id', type: DataType.INTEGER }) roleId!: number;

  @AllowNull(true) @Column({ field: 'created_by', type: DataType.INTEGER }) createdBy!: number | null;
  @CreatedAt @Column({ field: 'created_at', type: DataType.DATE }) createdAt?: Date;
}
