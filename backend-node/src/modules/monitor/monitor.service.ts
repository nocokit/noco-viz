import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as os from 'os';
import { AuditLog } from '../audit-log/entities/audit-log.entity';
import { User } from '../users/entities/user.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Dataset, DatasetStatus } from '../datasets/entities/dataset.entity';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // 获取系统资源信息
  async getSystemResources() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || 'Unknown';
    const cpuCount = cpus.length;

    // 计算CPU使用率（简化版）
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpuCount;

    return {
      cpu: {
        model: cpuModel,
        cores: cpuCount,
        usage: cpuUsage.toFixed(2),
      },
      memory: {
        total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usagePercent: memUsagePercent,
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        uptime: Math.floor(os.uptime() / 3600) + ' hours',
      },
    };
  }

  // 获取应用统计信息（带缓存）
  async getApplicationStats() {
    const cacheKey = 'monitor:app-stats';
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const [
      totalUsers,
      activeUsers,
      totalProjects,
      publishedProjects,
      totalDatasets,
      activeDatasets,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.projectRepository.count(),
      this.projectRepository.count({ where: { status: ProjectStatus.PUBLISHED } }),
      this.datasetRepository.count(),
      this.datasetRepository.count({ where: { status: DatasetStatus.ACTIVE } }),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      projects: {
        total: totalProjects,
        published: publishedProjects,
        draft: totalProjects - publishedProjects,
      },
      datasets: {
        total: totalDatasets,
        active: activeDatasets,
        inactive: totalDatasets - activeDatasets,
      },
    };

    // 缓存30秒
    await this.cacheManager.set(cacheKey, stats, 30000);

    return stats;
  }

  // 获取最近活动日志
  async getRecentActivities(limit: number = 20) {
    const activities = await this.auditLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      module: activity.module,
      description: activity.description,
      user: activity.user ? {
        id: activity.user.id,
        username: activity.user.username,
      } : null,
      createdAt: activity.createdAt,
    }));
  }

  // 获取API调用统计
  async getApiStats() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayCount, weekCount, totalCount] = await Promise.all([
      this.auditLogRepository.count({
        where: {
          createdAt: new Date(now.toDateString()),
        },
      }),
      this.auditLogRepository.count({
        where: {
          createdAt: new Date(oneWeekAgo.toDateString()),
        },
      }),
      this.auditLogRepository.count(),
    ]);

    return {
      today: todayCount,
      last24Hours: todayCount,
      lastWeek: weekCount,
      total: totalCount,
    };
  }

  // 获取错误日志统计
  async getErrorStats() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const errorLogs = await this.auditLogRepository
      .createQueryBuilder('log')
      .where('log.action LIKE :pattern', { pattern: '%error%' })
      .orWhere('log.action LIKE :pattern2', { pattern2: '%fail%' })
      .andWhere('log.createdAt >= :date', { date: oneDayAgo })
      .getCount();

    return {
      last24Hours: errorLogs,
      errorRate: 0, // TODO: 计算错误率
    };
  }

  // 获取完整监控数据
  async getMonitorData() {
    const [systemResources, appStats, recentActivities, apiStats, errorStats] = await Promise.all([
      this.getSystemResources(),
      this.getApplicationStats(),
      this.getRecentActivities(20),
      this.getApiStats(),
      this.getErrorStats(),
    ]);

    return {
      system: systemResources,
      application: appStats,
      activities: recentActivities,
      api: apiStats,
      errors: errorStats,
      timestamp: new Date(),
    };
  }
}
