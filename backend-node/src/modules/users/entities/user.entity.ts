import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { Project } from '../../projects/entities/project.entity';
import { Dataset } from '../../datasets/entities/dataset.entity';
import { Connection } from '../../datasets/entities/connection.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('users')
@Index(['isActive'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 150 })
  username: string;

  @Column({ unique: true, length: 254 })
  email: string;

  @Column({ name: 'first_name', length: 150, default: '' })
  firstName: string;

  @Column({ name: 'last_name', length: 150, default: '' })
  lastName: string;

  @Exclude()
  @Column({ length: 128 })
  password: string;

  @Column({ unique: true, nullable: true, length: 11 })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_staff', default: false })
  isStaff: boolean;

  @Column({ name: 'is_superuser', default: false })
  isSuperuser: boolean;

  @Column({ name: 'date_joined', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dateJoined: Date;

  @Column({ name: 'last_login', type: 'datetime', nullable: true })
  lastLogin: Date;

  // 角色关联
  @ManyToOne(() => Role, (role) => role.users, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  // 部门关联
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  // 创建的项目
  @OneToMany(() => Project, (project) => project.createdBy)
  projects: Project[];

  // 创建的数据集
  @OneToMany(() => Dataset, (dataset) => dataset.createdBy)
  datasets: Dataset[];

  // 创建的连接
  @OneToMany(() => Connection, (connection) => connection.createdBy)
  connections: Connection[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
