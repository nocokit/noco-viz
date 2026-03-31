import { IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 批量删除DTO
 */
export class BatchDeleteDto {
  @ApiProperty({
    description: 'ID列表',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1, { message: '至少选择一项' })
  @IsNotEmpty({ message: 'ID列表不能为空' })
  ids: number[];
}

/**
 * 批量更新状态DTO
 */
export class BatchUpdateStatusDto {
  @ApiProperty({
    description: 'ID列表',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1, { message: '至少选择一项' })
  @IsNotEmpty({ message: 'ID列表不能为空' })
  ids: number[];

  @ApiProperty({
    description: '状态',
    example: 'published',
  })
  @IsNotEmpty({ message: '状态不能为空' })
  status: string;
}

/**
 * 批量操作响应DTO
 */
export class BatchOperationResponseDto {
  @ApiProperty({ description: '成功数量' })
  successCount: number;

  @ApiProperty({ description: '失败数量' })
  failureCount: number;

  @ApiProperty({ description: '失败详情', type: [Object] })
  failures?: Array<{
    id: number;
    error: string;
  }>;
}
