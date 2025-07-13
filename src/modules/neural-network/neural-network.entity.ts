import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('tbl_neuralnetwork')
export default class NeuralNetwork {
  @PrimaryGeneratedColumn()
  id!: number; // <- esto dice a TS: “Confía, lo seteará TypeORM”

  @Column()
  modelo!: string;

  @Column()
  version!: string;

  @Column()
  accuracy!: string;

  @Column()
  status!: string;

  @Column({ name: 'url_file' })
  urlFile!: string;

  @Column({ name: 'created_by' })
  createdBy!: string;

  @CreateDateColumn({ name: 'created_at' })
  createAt!: Date;
}
