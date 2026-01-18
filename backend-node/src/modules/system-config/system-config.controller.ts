import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SystemConfigService } from './system-config.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { BatchUpdateConfigDto } from './dto/batch-update-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('system-config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Get()
  @ApiOperation({ summary: '获取所有系统配置' })
  findAll() {
    return this.configService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: '获取单个配置' })
  findOne(@Param('key') key: string) {
    return this.configService.findOne(key);
  }

  @Put(':key')
  @ApiOperation({ summary: '更新单个配置' })
  update(@Param('key') key: string, @Body() updateDto: UpdateConfigDto) {
    return this.configService.update(key, updateDto);
  }

  @Post('batch')
  @ApiOperation({ summary: '批量更新配置' })
  batchUpdate(@Body() batchUpdateDto: BatchUpdateConfigDto) {
    return this.configService.batchUpdate(batchUpdateDto.configs);
  }

  @Delete(':key')
  @ApiOperation({ summary: '删除配置' })
  remove(@Param('key') key: string) {
    return this.configService.remove(key);
  }
}
