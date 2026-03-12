import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { TemplateCategory } from '../entities/template.entity';

export class CreateTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TemplateCategory })
  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ required: false, description: '封面图片媒体资源ID' })
  @IsOptional()
  @IsNumber()
  thumbnailMediaId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  config?: Record<string, any>;
}
