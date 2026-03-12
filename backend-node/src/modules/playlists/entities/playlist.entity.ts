import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PlaylistStatus {
  PLAYING = 'playing',
  IDLE = 'idle',
}

export enum TransitionType {
  FADE = 'fade',
  NONE = 'none',
  SLIDE = 'slide',
}

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: PlaylistStatus,
    default: PlaylistStatus.IDLE,
  })
  status: PlaylistStatus;

  @Column({ length: 50 })
  resolution: string;

  @Column({ length: 500, nullable: true })
  url: string;

  @Column({
    type: 'enum',
    enum: TransitionType,
    default: TransitionType.FADE,
  })
  transition: TransitionType;

  @Column({ type: 'int', default: 60, comment: '切换间隔(秒)' })
  interval: number;

  @Column({ type: 'text', nullable: true, comment: '描述' })
  description: string;

  @Column({ type: 'json', nullable: true })
  slides: any[];

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
