// src/modules/masterdata/business.model.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface BusinessAttrs {
  id: number;
  companyName: string | null;
  tradeName: string | null;
  idNumber: string | null;
  country: string | null;
  category: string | null;
}
export type BusinessCreationAttrs = Optional<BusinessAttrs, 'id'|'companyName'|'tradeName'|'idNumber'|'country'|'category'>;

@Table({ tableName: 'tbl_business', timestamps: false })
export default class Business extends Model<BusinessAttrs, BusinessCreationAttrs> implements BusinessAttrs {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
  @Column({ field: 'company_name', type: DataType.STRING }) companyName!: string | null;
  @Column({ field: 'trade_name', type: DataType.STRING })  tradeName!: string | null;
  @Column({ field: 'id_number', type: DataType.STRING })   idNumber!: string | null;
  @Column({ field: 'country', type: DataType.STRING })      country!: string | null;
  @Column({ field: 'category', type: DataType.STRING })     category!: string | null;
}
