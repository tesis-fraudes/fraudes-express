// src/modules/transaction/fraud-event.model.ts
import {
  Table, Column, Model, PrimaryKey, AutoIncrement,
  AllowNull, DataType, CreatedAt
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface FraudEventAttrs {
  id: number;
  transactionId: number;
  userId: number | null;
  status: number | null;
  observation: string | null;
  result: string | null;
  consequences: string | null;
  createdBy: number | null;
  createdAt?: Date;            // autogenerado -> opcional
}

export type FraudEventCreationAttrs = Optional<
  FraudEventAttrs,
  | 'id'
  | 'userId' | 'status'
  | 'observation' | 'result' | 'consequences'
  | 'createdBy' | 'createdAt'
>;

@Table({ tableName: 'tbl_fraud_events', timestamps: false })
export default class FraudEvent
  extends Model<FraudEventAttrs, FraudEventCreationAttrs>
  implements FraudEventAttrs
{
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;

  @AllowNull(false)
  @Column({ field: 'transaction_id', type: DataType.INTEGER })
  transactionId!: number;

  @AllowNull(true)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  userId!: number | null;

  @AllowNull(true)
  @Column({ field: 'status', type: DataType.INTEGER })
  status!: number | null;

  @AllowNull(true)
  @Column({ field: 'observation', type: DataType.STRING })
  observation!: string | null;

  @AllowNull(true)
  @Column({ field: 'result', type: DataType.STRING })
  result!: string | null;

  @AllowNull(true)
  @Column({ field: 'consequences', type: DataType.STRING })
  consequences!: string | null;

  @AllowNull(true)
  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy!: number | null;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt?: Date;
}
