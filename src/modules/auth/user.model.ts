import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, CreatedAt, AllowNull, BelongsToMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import Role from './role.model';
import UserRole from './user-role.model';

export interface UserAttrs {
  id: number;
  names: string | null;
  lastName: string | null;
  secondLastName: string | null;
  idType: string | null;
  idNumber: string | null;
  phone: string | null;
  address: string | null;
  area: string | null;
  email: string | null;
  password: string | null;
  createdBy: number | null;
  createdAt?: Date;
}
export type UserCreationAttrs = Optional<UserAttrs,
  'id'|'names'|'lastName'|'secondLastName'|'idType'|'idNumber'|'phone'|'address'|'area'|'email'|'password'|'createdBy'|'createdAt'
>;

@Table({ tableName: 'tbl_users', timestamps: false })
export default class User extends Model<UserAttrs, UserCreationAttrs> implements UserAttrs {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;

  @Column({ field: 'names', type: DataType.STRING }) names!: string | null;
  @Column({ field: 'last_name', type: DataType.STRING }) lastName!: string | null;
  @Column({ field: 'second_last_name', type: DataType.STRING }) secondLastName!: string | null;

  @Column({ field: 'id_type', type: DataType.STRING })   idType!: string | null;
  @Column({ field: 'id_number', type: DataType.STRING }) idNumber!: string | null;

  @Column({ field: 'phone', type: DataType.STRING })   phone!: string | null;
  @Column({ field: 'address', type: DataType.STRING }) address!: string | null;
  @Column({ field: 'area', type: DataType.STRING })    area!: string | null;

  @Column({ field: 'email', type: DataType.STRING })    email!: string | null;
  @Column({ field: 'password', type: DataType.STRING }) password!: string | null;

  @AllowNull(true) @Column({ field: 'created_by', type: DataType.INTEGER }) createdBy!: number | null;
  @CreatedAt @Column({ field: 'created_at', type: DataType.DATE }) createdAt?: Date;

  @BelongsToMany(() => Role, () => UserRole)
  roles?: Role[];
}
