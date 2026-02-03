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
import { Media } from '../../media/entities/media.entity';

export enum TemplateStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REVIEWING = 'reviewing',
  REJECTED = 'rejected',
}

export enum TemplateCategory {
  DASHBOARD = 'dashboard',
  REPORT = 'report',
  CHART = 'chart',
  OTHER = 'other',
}

@Entity('templates')
@Index(['status', 'category'])
@Index(['category', 'createdAt'])
@Index(['createdById'])
@Index(['isOfficial', 'status'])
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TemplateCategory,
    default: TemplateCategory.OTHER,
  })
  category: TemplateCategory;

  @Column({ nullable: true, length: 500 })
  thumbnail: string;

  @Column({ name: 'thumbnail_media_id', nullable: true })
  thumbnailMediaId: number;

  @ManyToOne(() => Media, { nullable: true })
  @JoinColumn({ name: 'thumbnail_media_id' })
  thumbnailMedia: Media;

  @Column({ type: 'simple-json', nullable: true })
  config: Record<string, any>;

  @Column({
    type: 'enum',
    enum: TemplateStatus,
    default: TemplateStatus.DRAFT,
  })
  status: TemplateStatus;

  @Column({ name: 'usage_count', default: 0 })
  usageCount: number;

  @Column({ name: 'is_official', default: false })
  isOfficial: boolean;

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
