import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsObject } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ example: '自定义角色', description: '角色名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '这是一个自定义角色', description: '角色描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'dept', description: '数据权限范围: all, dept, self, custom', required: false })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiProperty({ example: false, description: '是否系统内置角色', required: false })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @ApiProperty({
    example: {
      users: { all: false, view: true, create: false, edit: false, delete: false },
      roles: { all: false, view: true, create: false, edit: false, delete: false }
    },
    description: '角色权限配置',
    required: false
  })
  @IsOptional()
  @IsObject()
  permissions?: any;

  // 兼容旧格式
  @ApiProperty({
    example: {
      name: '管理员',
      isSystem: false,
      scope: 'all',
      permissions: {}
    },
    description: '角色配置（JSON对象或字符串）',
    required: false
  })
  @IsOptional()
  value?: any;
}
