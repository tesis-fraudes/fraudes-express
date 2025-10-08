// src/modules/transaction/transaction.model.ts
import {
  Table, Column, Model, PrimaryKey, AutoIncrement, AllowNull,
  DataType, CreatedAt, HasMany, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import FraudEvent from './fraud-event.model';
import { Optional } from 'sequelize';
import Business from '../masterdata/business.model';

export interface TransactionAttrs {
  id: number;
  businessId: number;
  customerId: number;
  paymentId: number;

  amount: number | null;
  currency: string | null;
  hour: number | null;

  deviceType: string | null;
  browser: string | null;
  ipAddress: string | null;
  isProxy: boolean | null;
  countryIp: string | null;

  distanceHomeShipping: number | null;
  previousFrauds: number | null;
  avgMonthlySpend: number | null;

  fraudScore: number | null;
  modelId: number | null;

  status: number;         // 0/1/3/4
  createdBy: number | null;

  createdAt?: Date;       // generado por DB → opcional
}

// Qué campos son opcionales al crear:
export type TransactionCreationAttrs = Optional<
  TransactionAttrs,
  | 'id'
  | 'amount' | 'currency' | 'hour'
  | 'deviceType' | 'browser' | 'ipAddress' | 'isProxy' | 'countryIp'
  | 'distanceHomeShipping' | 'previousFrauds' | 'avgMonthlySpend'
  | 'fraudScore' | 'modelId'
  | 'createdBy' | 'createdAt'
>;

@Table({ tableName: 'tbl_transactions', timestamps: false })
export default class Transaction
  extends Model<TransactionAttrs, TransactionCreationAttrs>
  implements TransactionAttrs
{
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;

  @ForeignKey(() => Business) @AllowNull(false) @Column({ field: 'business_id', type: DataType.INTEGER }) businessId!: number;
  //@AllowNull(false) @Column({ field: 'business_id', type: DataType.INTEGER }) businessId!: number;
  @AllowNull(false) @Column({ field: 'customer_id', type: DataType.INTEGER }) customerId!: number;
  @AllowNull(false) @Column({ field: 'payment_id',  type: DataType.INTEGER }) paymentId!: number;

  @AllowNull(true)  @Column({ field: 'amount', type: DataType.FLOAT }) amount!: number | null;
  @AllowNull(true)  @Column({ field: 'currency', type: DataType.STRING }) currency!: string | null;
  @AllowNull(true)  @Column({ field: 'hour', type: DataType.INTEGER }) hour!: number | null;

  @AllowNull(true)  @Column({ field: 'device_type', type: DataType.STRING }) deviceType!: string | null;
  @AllowNull(true)  @Column({ field: 'browser', type: DataType.STRING })     browser!: string | null;
  @AllowNull(true)  @Column({ field: 'ip_address', type: DataType.STRING })   ipAddress!: string | null;
  @AllowNull(true)  @Column({ field: 'is_proxy', type: DataType.BOOLEAN })    isProxy!: boolean | null;
  @AllowNull(true)  @Column({ field: 'country_ip', type: DataType.STRING })   countryIp!: string | null;

  @AllowNull(true)  @Column({ field: 'distance_home_shipping', type: DataType.INTEGER }) distanceHomeShipping!: number | null;
  @AllowNull(true)  @Column({ field: 'previous_frauds', type: DataType.INTEGER })        previousFrauds!: number | null;
  @AllowNull(true)  @Column({ field: 'avg_monthly_spend', type: DataType.FLOAT })        avgMonthlySpend!: number | null;

  @AllowNull(true)  @Column({ field: 'fraud_score', type: DataType.INTEGER }) fraudScore!: number | null;
  @AllowNull(true)  @Column({ field: 'model_id', type: DataType.INTEGER })    modelId!: number | null;

  @AllowNull(false) @Column({ field: 'status', type: DataType.INTEGER }) status!: number;
  @AllowNull(true)  @Column({ field: 'created_by', type: DataType.INTEGER }) createdBy!: number | null;

  @CreatedAt @Column({ field: 'created_at', type: DataType.DATE }) createdAt?: Date;

  @HasMany(() => Business, { as: 'business', foreignKey: 'business_id' })
  business?: Business[];

  @HasMany(() => FraudEvent, { foreignKey: 'transaction_id', as: 'fraudEvents' })
  fraudEvents?: FraudEvent[];
}
