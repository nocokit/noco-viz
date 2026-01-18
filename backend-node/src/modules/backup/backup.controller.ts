import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBackupDto } from './dto/create-backup.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';

@ApiTags('backup')
@Controller('backup')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get()
  @ApiOperation({ summary: '获取备份列表' })
  async getBackupList() {
    return this.backupService.getBackupList();
  }

  @Get('config')
  @ApiOperation({ summary: '获取自动备份配置' })
  async getBackupConfig() {
    return this.backupService.getBackupConfig();
  }

  @Post('config')
  @ApiOperation({ summary: '更新自动备份配置' })
  async updateBackupConfig(@Body() config: any) {
    return this.backupService.updateBackupConfig(config);
  }

  @Post()
  @ApiOperation({ summary: '创建手动备份' })
  async createBackup(@Body() createBackupDto: CreateBackupDto) {
    return this.backupService.createBackup(createBackupDto);
  }

  @Get(':id/download')
  @ApiOperation({ summary: '下载备份文件' })
  async downloadBackup(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const backup = await this.backupService.getBackupById(id);
    const file = createReadStream(backup.filePath);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${backup.fileName}"`,
    });

    return new StreamableFile(file);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: '恢复备份' })
  async restoreBackup(@Param('id') id: number) {
    return this.backupService.restoreBackup(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除备份' })
  async deleteBackup(@Param('id') id: number) {
    return this.backupService.deleteBackup(id);
  }

  @Post('upload')
  @ApiOperation({ summary: '上传备份文件' })
  async uploadBackup(@Body() data: any) {
    return this.backupService.uploadBackup(data);
  }
}
