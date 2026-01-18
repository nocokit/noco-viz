import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'user_name', nullable: true })
  userName: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column()
  module: string;

  @Column()
  action: string;

  @Column({ name: 'action_type' })
  actionType: string; // create, update, delete, login, logout, etc.

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'request_method', nullable: true })
  requestMethod: string;

  @Column({ name: 'request_url', type: 'text', nullable: true })
  requestUrl: string;

  @Column({ name: 'request_body', type: 'text', nullable: true })
  requestBody: string;

  @Column({ name: 'response_status', nullable: true })
  responseStatus: number;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column()
  status: string; // success, fail

  @Column({ name: 'trace_id', nullable: true })
  traceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
