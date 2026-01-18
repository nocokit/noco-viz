import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Backup } from './backup.entity';
import { CreateBackupDto } from './dto/create-backup.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(Backup)
    private backupRepository: Repository<Backup>,
  ) {}

  async getBackupList() {
    const backups = await this.backupRepository.find({
      order: { createdAt: 'DESC' },
    });

    return backups.map(backup => ({
      id: backup.id,
      fileName: backup.fileName,
      version: backup.version,
      type: backup.type,
      size: this.formatSize(backup.size),
      sizeBytes: backup.size,
      note: backup.note,
      createTime: backup.createdAt,
      status: backup.status,
    }));
  }

  async getBackupConfig() {
    // 从系统配置表获取，这里返回默认值
    return {
      autoBackupEnabled: true,
      autoBackupTime: '02:00:00',
      retentionCount: 30,
    };
  }

  async updateBackupConfig(config: any) {
    // 更新系统配置表
    return {
      success: true,
      message: '自动备份配置已更新',
      config,
    };
  }

  async createBackup(createBackupDto: CreateBackupDto) {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const fileName = `backup_${timestamp}_manual.zip`;

    // 模拟备份过程
    const backup = this.backupRepository.create({
      fileName,
      version: 'System v2.4.0',
      type: 'manual',
      size: 45500000, // 45.5 MB
      note: createBackupDto.note,
      filePath: `/backups/${fileName}`,
      status: 'completed',
    });

    await this.backupRepository.save(backup);

    return {
      success: true,
      message: '备份创建成功',
      backup: {
        id: backup.id,
        fileName: backup.fileName,
        version: backup.version,
        type: backup.type,
        size: this.formatSize(backup.size),
        createTime: backup.createdAt,
      },
    };
  }

  async getBackupById(id: number) {
    const backup = await this.backupRepository.findOne({ where: { id } });
    if (!backup) {
      throw new NotFoundException('备份文件不存在');
    }
    return backup;
  }

  async restoreBackup(id: number) {
    const backup = await this.getBackupById(id);

    // 模拟恢复过程
    return {
      success: true,
      message: '恢复指令已发送，系统即将重启',
      backup: {
        fileName: backup.fileName,
        version: backup.version,
      },
    };
  }

  async deleteBackup(id: number) {
    const backup = await this.getBackupById(id);

    // 删除文件
    if (backup.filePath && fs.existsSync(backup.filePath)) {
      fs.unlinkSync(backup.filePath);
    }

    await this.backupRepository.delete(id);

    return {
      success: true,
      message: '备份已删除',
    };
  }

  async uploadBackup(data: any) {
    // 处理上传的备份文件
    return {
      success: true,
      message: '备份文件上传成功',
    };
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
