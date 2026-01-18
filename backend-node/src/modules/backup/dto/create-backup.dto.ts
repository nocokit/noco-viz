import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBackupDto {
  @ApiProperty({ description: '备份备注', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
