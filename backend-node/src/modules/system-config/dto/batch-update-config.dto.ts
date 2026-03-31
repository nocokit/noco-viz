import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchUpdateConfigDto {
  @ApiProperty({ 
    description: '配置对象',
    example: {
      'system.name': 'NocoViz',
      'system.language': 'zh-CN',
      'security.watermark': 'true'
    }
  })
  @IsObject()
  configs: Record<string, any>;
}
