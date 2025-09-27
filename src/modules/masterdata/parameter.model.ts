// src/modules/masterdata/parameter.model.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface ParameterAttrs {
  id: number;
  name: string;
  clave: string;
  valor: string;
  status: number;
}
export type ParameterCreationAttrs = Optional<ParameterAttrs, 'id'>;

@Table({ tableName: 'tbl_parameters', timestamps: false })
export default class Parameter extends Model<ParameterAttrs, ParameterCreationAttrs> implements ParameterAttrs {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
  @Column({ field: 'name', type: DataType.STRING })  name!: string;
  @Column({ field: 'clave', type: DataType.STRING }) clave!: string;
  @Column({ field: 'valor', type: DataType.STRING }) valor!: string;
  @Column({ field: 'status', type: DataType.INTEGER }) status!: number;
}
