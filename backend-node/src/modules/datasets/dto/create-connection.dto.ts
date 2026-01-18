import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber } from 'class-validator';
import { ConnectionType } from '../entities/connection.entity';

export class CreateConnectionDto {
  @ApiProperty({ example: 'MySQL生产库', description: '连接名称' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'mysql',
    enum: ConnectionType,
    description: '数据库类型',
  })
  @IsEnum(ConnectionType)
  type: ConnectionType;

  @ApiProperty({ example: 'localhost', description: '主机地址' })
  @IsString()
  host: string;

  @ApiProperty({ example: 3306, description: '端口' })
  @IsNumber()
  port: number;

  @ApiProperty({ example: 'mydb', description: '数据库名' })
  @IsString()
  database: string;

  @ApiProperty({ example: 'root', description: '用户名' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  password: string;
}
