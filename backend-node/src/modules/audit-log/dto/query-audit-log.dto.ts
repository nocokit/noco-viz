import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryAuditLogDto {
  @ApiProperty({ description: '搜索关键词（操作人或IP）', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '模块筛选', required: false })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiProperty({ description: '状态筛选', enum: ['success', 'fail'], required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '操作类型筛选', enum: ['login', 'logout', 'create', 'update', 'delete', 'view', 'export', 'import', 'other'], required: false })
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiProperty({ description: '开始日期', example: '2024-01-01', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: '结束日期', example: '2024-12-31', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ description: '页码', example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 20, required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 20;
}
