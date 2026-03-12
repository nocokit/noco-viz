import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class BatchUpdateRoleDto {
  @ApiProperty({
    example: {
      admin: {
        name: '管理员',
        isSystem: true,
        scope: 'all',
        permissions: { users: 'all', projects: 'all' }
      },
      editor: {
        name: '编辑员',
        isSystem: false,
        scope: 'dept',
        permissions: { projects: 'edit', media: 'all' }
      }
    },
    description: '角色配置对象，key为角色标识，value为角色配置'
  })
  @IsNotEmpty()
  @IsObject()
  roles: Record<string, any>;
}
