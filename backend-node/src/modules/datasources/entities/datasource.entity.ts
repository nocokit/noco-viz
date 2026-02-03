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

export enum DatasourceType {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  MONGODB = 'mongodb',
  REDIS = 'redis',
  RESTAPI = 'restapi',
  GRAPHQL = 'graphql',
}

export enum DatasourceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

@Entity('datasources')
@Index(['type'])
@Index(['status'])
@Index(['createdById'])
export class Datasource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: DatasourceType,
  })
  type: DatasourceType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json' })
  config: {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    url?: string;
    headers?: Record<string, string>;
    authType?: string;
    ssl?: boolean;
    [key: string]: any;
  };

  @Column({
    type: 'enum',
    enum: DatasourceStatus,
    default: DatasourceStatus.INACTIVE,
  })
  status: DatasourceStatus;

  @Column({ name: 'last_test_at', type: 'timestamp', nullable: true })
  lastTestAt: Date;

  @Column({ name: 'last_test_result', type: 'text', nullable: true })
  lastTestResult: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
