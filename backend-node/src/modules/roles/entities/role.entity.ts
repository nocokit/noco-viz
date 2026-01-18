import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DataScope {
  ALL = 'all',
  DEPT = 'dept',
  SELF = 'self',
  CUSTOM = 'custom',
}

@Entity('roles')
@Index(['isSystem'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_system', default: false })
  isSystem: boolean;

  @Column({
    type: 'enum',
    enum: DataScope,
    default: DataScope.SELF,
  })
  scope: DataScope;

  @Column({ type: 'simple-json', nullable: true })
  permissions: Record<string, any>;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
