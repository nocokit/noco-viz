import { IsEnum, IsObject } from 'class-validator';
import { DatasourceType } from '../entities/datasource.entity';

export class TestConnectionDto {
  @IsEnum(DatasourceType)
  type: DatasourceType;

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
