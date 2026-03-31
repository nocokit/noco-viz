import { IsString, IsOptional } from 'class-validator';

export class CreateDataGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
