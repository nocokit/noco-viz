import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DatasetType {
  EXCEL = 'excel',
  SQL = 'sql',
  API = 'api',
}

export enum DatasetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('datasets')
@Index(['type'])
@Index(['status'])
@Index(['createdById'])
export class Dataset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: DatasetType,
  })
  type: DatasetType;

  @Column({ type: 'simple-json', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  fields: any[];

  @Column({ name: 'row_count', default: 0 })
  rowCount: number;

  @Column({
    type: 'enum',
    enum: DatasetStatus,
    default: DatasetStatus.ACTIVE,
  })
  status: DatasetStatus;

  @ManyToOne(() => User, (user) => user.datasets)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
