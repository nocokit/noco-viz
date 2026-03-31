import { IsString, IsEnum, IsOptional, IsObject, MaxLength } from 'class-validator';
import { DatasourceType } from '../entities/datasource.entity';

export class CreateDatasourceDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsEnum(DatasourceType)
  type: DatasourceType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  config: {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    url?: string;
    headers?: Record<string, string>;
    authType?: string;
    ssl?: boolean;
    [key: string]: any;
  };
}
