import { IsString, IsOptional, IsBoolean, IsArray, MaxLength } from 'class-validator';

export class CreateComponentDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(50)
  category: string;

  @IsString()
  @MaxLength(50)
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  config?: Record<string, any>;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  version?: string;
}
