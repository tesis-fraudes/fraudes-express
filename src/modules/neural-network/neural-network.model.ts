// src/modules/neural-network/neural-network.model.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, CreatedAt } from 'sequelize-typescript';

@Table({ tableName: 'tbl_neuralnetwork', timestamps: false })
export default class NeuralNetwork extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  modelo!: string;

  @Column
  version!: string;

  @Column
  accuracy!: string;

  @Column
  status!: string;

  @Column({ field: 'url_file' })
  urlFile!: string;

  @Column({ field: 'created_by' })
  createdBy!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createAt!: Date;
}
