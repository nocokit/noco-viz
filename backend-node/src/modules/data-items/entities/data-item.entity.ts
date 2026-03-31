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
import { DataGroup } from '../../data-groups/entities/data-group.entity';
import { Datasource } from '../../datasources/entities/datasource.entity';

export enum DataItemType {
  SQL = 'sql',
  API = 'api',
  EXCEL = 'excel',
  JSON = 'json',
}

@Entity('data_items')
@Index(['type'])
@Index(['groupId'])
export class DataItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: DataItemType,
  })
  type: DataItemType;

  @Column({ name: 'group_id' })
  groupId: number;

  @ManyToOne(() => DataGroup)
  @JoinColumn({ name: 'group_id' })
  group: DataGroup;

  @Column({ name: 'datasource_id', nullable: true })
  datasourceId: number;

  @ManyToOne(() => Datasource, { nullable: true })
  @JoinColumn({ name: 'datasource_id' })
  datasource: Datasource;

  @Column({ type: 'text', nullable: true })
  query: string;

  @Column({ type: 'simple-json', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  data: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
