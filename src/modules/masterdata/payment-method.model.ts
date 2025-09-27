// src/modules/masterdata/payment-method.model.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, CreatedAt, AllowNull } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface PaymentMethodAttrs {
  id: number;
  customerId: number;
  typePayment: string | null;
  provider: string | null;
  number: string | null;
  status: number | null;
  country: string | null;
  createdBy: number | null;
  createdAt?: Date;
}
export type PaymentMethodCreationAttrs = Optional<PaymentMethodAttrs, 'id'|'typePayment'|'provider'|'number'|'status'|'country'|'createdBy'|'createdAt'>;

@Table({ tableName: 'tbl_payment_methods', timestamps: false })
export default class PaymentMethod extends Model<PaymentMethodAttrs, PaymentMethodCreationAttrs> implements PaymentMethodAttrs {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
  @Column({ field: 'customer_id', type: DataType.INTEGER }) customerId!: number;
  @Column({ field: 'type_payment', type: DataType.STRING }) typePayment!: string | null;
  @Column({ field: 'provider', type: DataType.STRING })     provider!: string | null;
  @Column({ field: 'number', type: DataType.STRING })       number!: string | null;
  @Column({ field: 'status', type: DataType.INTEGER })      status!: number | null;
  @Column({ field: 'country', type: DataType.STRING })      country!: string | null;
  @AllowNull(true) @Column({ field: 'created_by', type: DataType.INTEGER }) createdBy!: number | null;
  @CreatedAt @Column({ field: 'created_at', type: DataType.DATE }) createdAt?: Date;
}
