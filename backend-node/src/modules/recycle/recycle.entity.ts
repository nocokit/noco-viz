import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('recycle_bin')
export class RecycleBin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500, nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: ['project', 'datasource', 'media', 'component'],
  })
  type: string;

  @Column({ type: 'int' })
  originalId: number;

  @Column({ type: 'json', nullable: true })
  originalData: any;

  @Column({ type: 'int', nullable: true })
  deletedById: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deletedById' })
  deletedBy: User;

  @Column({ type: 'int', default: 30 })
  daysLeft: number;

  @Column({ type: 'datetime', nullable: true })
  autoDeleteAt: Date;

  @CreateDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
