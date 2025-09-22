// src/modules/neural-network/neural-network.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  AllowNull,
  Default,
  DataType,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface NeuralNetworkAttrs {
  id: number;
  modelName: string;       // columna 'name'
  s3Bucket: string | null;
  modelKey: string | null;
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  tp: number | null;
  tn: number | null;
  fp: number | null;
  fn: number | null;
  userId: number;
  status: number;          // si usas enum numérico, déjalo number
  createdAt?: Date;
}

// Qué campos son opcionales al crear:
export type NeuralNetworkCreationAttrs = Optional<
  NeuralNetworkAttrs,
  | 'id'
  | 's3Bucket' | 'modelKey'
  | 'accuracy' | 'precision' | 'recall' | 'f1'
  | 'tp' | 'tn' | 'fp' | 'fn'
  | 'createdAt'
>;

@Table({ tableName: 'tbl_neuralnetwork', timestamps: false })
export default class NeuralNetwork
  extends Model<NeuralNetworkAttrs, NeuralNetworkCreationAttrs>
  implements NeuralNetworkAttrs {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column({ field: 'name', type: DataType.STRING(150) })
  modelName!: string;

  @AllowNull(true)
  @Column({ field: 's3_bucket', type: DataType.STRING })
  s3Bucket!: string | null;

  @AllowNull(true)
  @Column({ field: 'model_key', type: DataType.STRING })
  modelKey!: string | null;

  @AllowNull(true) @Column(DataType.FLOAT) accuracy!: number | null;
  @AllowNull(true) @Column(DataType.FLOAT) precision!: number | null;
  @AllowNull(true) @Column(DataType.FLOAT) recall!: number | null;
  @AllowNull(true) @Column(DataType.FLOAT) f1!: number | null;

  @AllowNull(true) @Column(DataType.INTEGER) tp!: number | null;
  @AllowNull(true) @Column(DataType.INTEGER) tn!: number | null;
  @AllowNull(true) @Column(DataType.INTEGER) fp!: number | null;
  @AllowNull(true) @Column(DataType.INTEGER) fn!: number | null;

  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  userId!: number;

  @AllowNull(false)
  @Default(0) // opcional: valor por defecto; ajusta a tu convenio
  @Column({ type: DataType.INTEGER })
  status!: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createAt!: Date;
}
