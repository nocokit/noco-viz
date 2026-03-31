import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../entities/media.entity';

export class CreateMediaDto {
  @ApiProperty({ description: '文件名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '文件URL' })
  @IsString()
  url: string;

  @ApiProperty({ description: '文件路径', required: false })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiProperty({ description: '文件类型', enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ description: 'MIME类型', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: '文件大小(字节)' })
  @IsNumber()
  size: number;

  @ApiProperty({ description: '图片宽度', required: false })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty({ description: '图片高度', required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ description: '分类', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: '描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '元数据', required: false })
  @IsOptional()
  metadata?: any;
}
