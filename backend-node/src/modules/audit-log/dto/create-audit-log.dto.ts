import { IsString, IsNotEmpty, IsOptional, IsInt, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiProperty({ description: '用户ID', required: false })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiProperty({ description: '用户名', required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ description: 'IP地址', example: '192.168.1.1' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ description: '用户代理', required: false })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiProperty({ description: '模块名称', example: 'IP白名单' })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiProperty({ description: '操作名称', example: '新建' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: '操作类型', example: 'create' })
  @IsString()
  @IsNotEmpty()
  actionType: string;

  @ApiProperty({ description: '操作描述', example: '新建IP白名单: 192.168.1.1' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '请求数据',
    required: false,
    example: {
      method: 'POST',
      url: '/api/ip-whitelist',
      body: { ip: '192.168.1.1', description: '测试' },
      query: {},
      params: {}
    }
  })
  @IsObject()
  @IsOptional()
  requestData?: {
    method?: string;
    url?: string;
    body?: any;
    query?: any;
    params?: any;
  };

  @ApiProperty({
    description: '响应数据',
    required: false,
    example: {
      status: 200,
      message: '创建成功'
    }
  })
  @IsObject()
  @IsOptional()
  responseData?: {
    status?: number;
    error?: string;
    message?: string;
  };

  @ApiProperty({ description: '操作状态', example: 'success' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: '追踪ID', required: false })
  @IsString()
  @IsOptional()
  traceId?: string;
}
