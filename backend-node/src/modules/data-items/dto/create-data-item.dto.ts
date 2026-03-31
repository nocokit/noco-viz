import { IsString, IsEnum, IsNumber, IsOptional, IsObject } from 'class-validator';
import { DataItemType } from '../entities/data-item.entity';

export class CreateDataItemDto {
  @IsString()
  name: string;

  @IsEnum(DataItemType)
  type: DataItemType;

  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  datasourceId?: number;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  data?: any;
}
