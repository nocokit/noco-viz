import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsArray, IsEnum } from 'class-validator';
import { DataScope } from '../entities/role.entity';

export class CreateRoleDto {
  @ApiProperty({ example: '管理员', description: '角色名称' })
  @IsString()
  name: string;

  @ApiProperty({ example: '系统管理员角色', description: '角色描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, description: '是否系统内置', required: false })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @ApiProperty({
    example: 'all',
    enum: DataScope,
    description: '数据权限范围',
    required: false,
  })
  @IsOptional()
  @IsEnum(DataScope)
  scope?: DataScope;

  @ApiProperty({
    example: {
      users: 'all',
      projects: 'all',
      datasets: 'all',
      templates: 'all',
      media: 'all',
      system: 'all'
    },
    description: '权限配置对象',
    required: false,
  })
  @IsOptional()
  permissions?: Record<string, any>;
}
