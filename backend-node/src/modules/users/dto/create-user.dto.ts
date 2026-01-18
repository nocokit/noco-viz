import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: '用户名' })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  username: string;

  @ApiProperty({ example: 'john@example.com', description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: '密码（至少6位）' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: '名字', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: '姓氏', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  lastName?: string;

  @ApiProperty({ example: '13800138000', description: '手机号', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiProperty({ example: 1, description: '角色ID', required: false })
  @IsOptional()
  roleId?: number;
}
