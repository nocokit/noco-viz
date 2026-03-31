import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
@Index(['module', 'status', 'createdAt'])
@Index(['actionType', 'createdAt'])
@Index(['userId', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_name', type: 'varchar', length: 100, nullable: true })
  userName: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 100 })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ name: 'action_type', type: 'varchar', length: 20 })
  actionType: string; // create, update, delete, login, logout, view, export, import, other

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'request_data', type: 'json', nullable: true })
  requestData: {
    method?: string;
    url?: string;
    body?: any;
    query?: any;
    params?: any;
  };

  @Column({ name: 'response_data', type: 'json', nullable: true })
  responseData: {
    status?: number;
    error?: string;
    message?: string;
  };

  @Column({ type: 'varchar', length: 20 })
  status: string; // success, fail

  @Column({ name: 'trace_id', type: 'varchar', length: 100, nullable: true })
  traceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
