import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UrlParamDto {
  @ApiProperty({ description: '参数名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '是否必填' })
  required: boolean;

  @ApiProperty({ description: '参数说明' })
  @IsString()
  description: string;
}

export class CreateIntegrationPublishDto {
  @ApiProperty({ description: '项目ID' })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({
    description: '认证方式',
    enum: ['sign', 'public'],
    default: 'public',
  })
  @IsEnum(['sign', 'public'])
  authType: 'sign' | 'public';

  @ApiProperty({ description: '嵌入域名白名单', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domains?: string[];

  @ApiProperty({ description: '接收参数', required: false })
  @IsOptional()
  @IsString()
  params?: string;

  @ApiProperty({ description: 'URL参数配置', type: [UrlParamDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UrlParamDto)
  urlParams?: UrlParamDto[];

  @ApiProperty({
    description: '状态',
    enum: ['online', 'offline'],
    default: 'online',
  })
  @IsOptional()
  @IsEnum(['online', 'offline'])
  status?: 'online' | 'offline';

  @ApiProperty({ description: '示例URL', required: false })
  @IsOptional()
  @IsString()
  sampleUrl?: string;
}
