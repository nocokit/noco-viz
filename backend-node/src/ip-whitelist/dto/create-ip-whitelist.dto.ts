import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIpWhitelistDto {
  @ApiProperty({ description: 'IP地址或CIDR网段', example: '192.168.1.1' })
  @IsString()
  @IsNotEmpty()
  ip: string;

  @ApiProperty({ description: '备注说明', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
