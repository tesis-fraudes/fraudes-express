// src/modules/transaction/prediction.model.ts
import {
  Table, Column, Model, PrimaryKey, AutoIncrement,
  AllowNull, DataType, CreatedAt
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface PredictionAttrs {
  id: number;
  modelId: number;
  transactionId: number;

  fraudScore: number | null;
  klass: string | null;               // mapea a columna 'class'
  prediction: number | null;
  fraudProbability: number | null;

  createdBy: number | null;
  createdAt?: Date;                   // generado por DB → opcional
}

export type PredictionCreationAttrs = Optional<
  PredictionAttrs,
  'id' | 'fraudScore' | 'klass' | 'prediction' | 'fraudProbability' | 'createdBy' | 'createdAt'
>;

@Table({ tableName: 'tbl_predictions', timestamps: false })
export default class Prediction
  extends Model<PredictionAttrs, PredictionCreationAttrs>
  implements PredictionAttrs
{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column({ field: 'model_id', type: DataType.INTEGER })
  modelId!: number;

  @AllowNull(false)
  @Column({ field: 'transaction_id', type: DataType.INTEGER })
  transactionId!: number;

  @AllowNull(true)
  @Column({ field: 'fraud_score', type: DataType.INTEGER })
  fraudScore!: number | null;

  @AllowNull(true)
  @Column({ field: 'class', type: DataType.STRING })
  klass!: string | null;

  @AllowNull(true)
  @Column({ field: 'prediction', type: DataType.INTEGER })
  prediction!: number | null;

  @AllowNull(true)
  @Column({ field: 'fraud_probability', type: DataType.FLOAT })
  fraudProbability!: number | null;

  @AllowNull(true)
  @Column({ field: 'created_by', type: DataType.INTEGER })
  createdBy!: number | null;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt?: Date;
}
