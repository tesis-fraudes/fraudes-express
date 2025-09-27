// src/modules/masterdata/customer.model.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, CreatedAt, AllowNull } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface CustomerAttrs {
  id: number;
  name: string | null;
  idType: string | null;
  idNumber: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  createdBy: number | null;
  createdAt?: Date;
}
export type CustomerCreationAttrs = Optional<CustomerAttrs, 'id'|'name'|'idType'|'idNumber'|'phone'|'address'|'city'|'country'|'createdBy'|'createdAt'>;

@Table({ tableName: 'tbl_customers', timestamps: false })
export default class Customer extends Model<CustomerAttrs, CustomerCreationAttrs> implements CustomerAttrs {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
  @Column({ field: 'name', type: DataType.STRING })     name!: string | null;
  @Column({ field: 'id_type', type: DataType.STRING })  idType!: string | null;
  @Column({ field: 'id_number', type: DataType.STRING }) idNumber!: string | null;
  @Column({ field: 'phone', type: DataType.STRING })    phone!: string | null;
  @Column({ field: 'address', type: DataType.STRING })  address!: string | null;
  @Column({ field: 'city', type: DataType.STRING })     city!: string | null;
  @Column({ field: 'country', type: DataType.STRING })  country!: string | null;
  @AllowNull(true) @Column({ field: 'created_by', type: DataType.INTEGER }) createdBy!: number | null;
  @CreatedAt @Column({ field: 'created_at', type: DataType.DATE }) createdAt?: Date;
}
