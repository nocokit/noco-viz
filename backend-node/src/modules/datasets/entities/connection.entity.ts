import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as crypto from 'crypto';

export enum ConnectionType {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  ORACLE = 'oracle',
  SQLSERVER = 'sqlserver',
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

@Entity('connections')
@Index(['type'])
@Index(['status'])
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: ConnectionType,
  })
  type: ConnectionType;

  @Column({ length: 200 })
  host: string;

  @Column()
  port: number;

  @Column({ length: 200 })
  database: string;

  @Column({ length: 200 })
  username: string;

  @Column({ length: 500 })
  password: string;

  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.DISCONNECTED,
  })
  status: ConnectionStatus;

  @Column({ name: 'last_test_time', type: 'datetime', nullable: true })
  lastTestTime: Date;

  @ManyToOne(() => User, (user) => user.connections)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 加密密码
  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    if (this.password && !this.password.startsWith('encrypted:')) {
      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(process.env.JWT_SECRET || 'your-secret-key').slice(0, 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);

      let encrypted = cipher.update(this.password, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      this.password = 'encrypted:' + iv.toString('hex') + ':' + encrypted;
    }
  }

  // 解密密码（用于连接数据库）
  getDecryptedPassword(): string {
    if (!this.password.startsWith('encrypted:')) {
      return this.password;
    }

    try {
      const parts = this.password.split(':');
      const iv = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(process.env.JWT_SECRET || 'your-secret-key').slice(0, 32);
      const decipher = crypto.createDecipheriv(algorithm, key, iv);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      return null;
    }
  }
}
