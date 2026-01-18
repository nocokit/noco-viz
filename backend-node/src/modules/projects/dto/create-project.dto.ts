import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject, IsUrl } from 'class-validator';
import { ProjectType, ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: '销售数据大屏', description: '项目名称' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'screen',
    enum: ProjectType,
    description: '项目类型',
  })
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiProperty({
    example: '展示销售数据的可视化大屏',
    description: '项目描述',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/cover.png',
    description: '封面图片',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiProperty({
    example: 'draft',
    enum: ProjectStatus,
    description: '状态',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({
    example: { theme: 'dark', layout: 'grid' },
    description: '配置信息',
    required: false,
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
