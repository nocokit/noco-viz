import { PartialType } from '@nestjs/swagger';
import { CreateIpWhitelistDto } from './create-ip-whitelist.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIpWhitelistDto extends PartialType(CreateIpWhitelistDto) {
  @ApiProperty({ description: '是否启用', required: false })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
