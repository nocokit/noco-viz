import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('integration_publish')
export class IntegrationPublish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({
    type: 'enum',
    enum: ['sign', 'public'],
    default: 'public',
    name: 'auth_type',
  })
  authType: 'sign' | 'public';

  @Column({ type: 'json', nullable: true })
  domains: string[];

  @Column({ type: 'text', nullable: true })
  params: string;

  @Column({ type: 'json', nullable: true, name: 'url_params' })
  urlParams: Array<{
    name: string;
    required: boolean;
    description: string;
  }>;

  @Column({
    type: 'enum',
    enum: ['online', 'offline'],
    default: 'online',
  })
  status: 'online' | 'offline';

  @Column({ type: 'text', nullable: true, name: 'sample_url' })
  sampleUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
