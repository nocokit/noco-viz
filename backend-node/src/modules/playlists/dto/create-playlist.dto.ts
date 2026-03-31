import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransitionType } from '../entities/playlist.entity';

export class CreatePlaylistDto {
  @ApiProperty({ description: '轮播组名称', example: '公司大堂主屏' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '分辨率', example: '1920x1080' })
  @IsString()
  @IsNotEmpty()
  resolution: string;

  @ApiProperty({ description: '过渡效果', enum: TransitionType, example: 'fade' })
  @IsEnum(TransitionType)
  @IsNotEmpty()
  transition: TransitionType;

  @ApiProperty({ description: '切换间隔(秒)', example: 60, required: false })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  interval?: number;

  @ApiProperty({ description: '描述', example: '用于公司大堂展示', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '轮播项列表', required: false })
  @IsArray()
  @IsOptional()
  slides?: any[];
}
