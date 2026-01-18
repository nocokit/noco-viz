import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject, IsArray, IsNumber } from 'class-validator';
import { DatasetType, DatasetStatus } from '../entities/dataset.entity';

export class CreateDatasetDto {
  @ApiProperty({ example: '销售数据集', description: '数据集名称' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'excel',
    enum: DatasetType,
    description: '数据源类型',
  })
  @IsEnum(DatasetType)
  type: DatasetType;

  @ApiProperty({
    example: { fileUrl: 'https://example.com/data.xlsx' },
    description: '配置信息',
    required: false,
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty({
    example: [{ name: 'id', type: 'number' }, { name: 'name', type: 'string' }],
    description: '字段列表',
    required: false,
  })
  @IsOptional()
  @IsArray()
  fields?: any[];

  @ApiProperty({ example: 100, description: '数据行数', required: false })
  @IsOptional()
  @IsNumber()
  rowCount?: number;

  @ApiProperty({
    example: 'active',
    enum: DatasetStatus,
    description: '状态',
    required: false,
  })
  @IsOptional()
  @IsEnum(DatasetStatus)
  status?: DatasetStatus;
}
