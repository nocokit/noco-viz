import { IsUsername, IsRequiredEmail, IsPassword, IsOptionalString, IsOptionalPhone, IsOptionalInt } from '../../../common/decorators/validation.decorator';

export class CreateUserDto {
  @IsUsername({ description: '用户名', example: 'johndoe' })
  username: string;

  @IsRequiredEmail({ description: '邮箱', example: 'john@example.com' })
  email: string;

  @IsPassword({ description: '密码（至少6位）', example: 'password123' })
  password: string;

  @IsOptionalString({ maxLength: 150, description: '名字', example: 'John' })
  firstName?: string;

  @IsOptionalString({ maxLength: 150, description: '姓氏', example: 'Doe' })
  lastName?: string;

  @IsOptionalPhone({ description: '手机号', example: '13800138000' })
  phone?: string;

  @IsOptionalInt({ description: '角色ID', example: 1 })
  roleId?: number;
}
