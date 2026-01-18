import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('custom_components')
@Index(['category'])
@Index(['creatorId'])
@Index(['isPublic'])
export class CustomComponent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  category: string;

  @Column({ length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  thumbnail: string;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({ type: 'json', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  code: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ name: 'creator_id', nullable: true })
  creatorId: number;

  @Column({ name: 'creator_name', length: 100, nullable: true })
  creatorName: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ length: 20, default: '1.0.0' })
  version: string;

  @Column({ default: 0 })
  downloads: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
