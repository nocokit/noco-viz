import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConfigDto {
  @ApiProperty({ description: '配置值' })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ description: '配置描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
