import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tbl_neuralnetwork')
export class NeuralNetwork {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  modelo!: string;

  @Column()
  version!: string;

  @Column()
  accuracy!: string;

  @Column()
  status!: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt!: Date;

  @Column({ name: 'url_file' })
  urlFile!: string;
}