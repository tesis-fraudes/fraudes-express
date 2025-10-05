import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, CreatedAt, AllowNull, BelongsToMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import User from './user.model';
import UserRole from './user-role.model';

export interface RoleAttrs {
  id: number;
  name: string | null;
  createdBy: number | null;
  createdAt?: Date;
}
export type RoleCreationAttrs = Optional<RoleAttrs, 'id'|'name'|'createdBy'|'createdAt'>;

@Table({ tableName: 'tbl_roles', timestamps: false })
export default class Role extends Model<RoleAttrs, RoleCreationAttrs> implements RoleAttrs {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
  @Column({ field: 'name', type: DataType.STRING }) name!: string | null;
  @AllowNull(true) @Column({ field: 'created_by', type: DataType.INTEGER }) createdBy!: number | null;
  @CreatedAt @Column({ field: 'created_at', type: DataType.DATE }) createdAt?: Date;

  @BelongsToMany(() => User, () => UserRole)
  users?: User[];
}
