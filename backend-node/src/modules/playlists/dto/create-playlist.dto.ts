import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
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

  @ApiProperty({ description: '轮播项列表', required: false })
  @IsArray()
  @IsOptional()
  slides?: any[];
}
