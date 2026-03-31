import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('backups')
export class Backup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 100 })
  version: string;

  @Column({ type: 'enum', enum: ['auto', 'manual'], default: 'manual' })
  type: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ length: 500, nullable: true })
  filePath: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ default: 'completed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
