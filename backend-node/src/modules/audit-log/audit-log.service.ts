import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return await this.auditLogRepository.save(auditLog);
  }

  async findAll(queryDto: QueryAuditLogDto) {
    const { search, module, status, actionType, startDate, endDate, page = 1, pageSize = 20 } = queryDto;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');

    // 搜索条件：操作人或IP
    if (search) {
      queryBuilder.andWhere(
        '(audit_log.user_name LIKE :search OR audit_log.ip_address LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 模块筛选
    if (module) {
      queryBuilder.andWhere('audit_log.module = :module', { module });
    }

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('audit_log.status = :status', { status });
    }

    // 操作类型筛选
    if (actionType) {
      queryBuilder.andWhere('audit_log.action_type = :actionType', { actionType });
    }

    // 日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('audit_log.created_at BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate + ' 23:59:59'),
      });
    } else if (startDate) {
      queryBuilder.andWhere('audit_log.created_at >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      queryBuilder.andWhere('audit_log.created_at <= :endDate', {
        endDate: new Date(endDate + ' 23:59:59'),
      });
    }

    // 排序
    queryBuilder.orderBy('audit_log.created_at', 'DESC');

    // 分页
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number): Promise<AuditLog> {
    const auditLog = await this.auditLogRepository.findOne({ where: { id } });

    if (!auditLog) {
      throw new NotFoundException(`审计日志 #${id} 不存在`);
    }

    return auditLog;
  }

  async remove(id: number) {
    const auditLog = await this.findOne(id);
    await this.auditLogRepository.remove(auditLog);
    return { message: '删除成功' };
  }

  async getStatistics() {
    const total = await this.auditLogRepository.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.auditLogRepository.count({
      where: {
        createdAt: Between(today, new Date()),
      },
    });

    const successCount = await this.auditLogRepository.count({
      where: { status: 'success' },
    });

    const failCount = await this.auditLogRepository.count({
      where: { status: 'fail' },
    });

    return {
      total,
      todayCount,
      successCount,
      failCount,
    };
  }

  async export(queryDto: QueryAuditLogDto) {
    const { search, module, status, actionType, startDate, endDate } = queryDto;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');

    // 应用相同的筛选条件
    if (search) {
      queryBuilder.andWhere(
        '(audit_log.user_name LIKE :search OR audit_log.ip_address LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (module) {
      queryBuilder.andWhere('audit_log.module = :module', { module });
    }

    if (status) {
      queryBuilder.andWhere('audit_log.status = :status', { status });
    }

    if (actionType) {
      queryBuilder.andWhere('audit_log.action_type = :actionType', { actionType });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('audit_log.created_at BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate + ' 23:59:59'),
      });
    } else if (startDate) {
      queryBuilder.andWhere('audit_log.created_at >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      queryBuilder.andWhere('audit_log.created_at <= :endDate', {
        endDate: new Date(endDate + ' 23:59:59'),
      });
    }

    // 排序
    queryBuilder.orderBy('audit_log.created_at', 'DESC');

    const data = await queryBuilder.getMany();

    // 生成 CSV 内容
    const headers = ['操作时间', '操作人', 'IP地址', '功能模块', '操作类型', '操作描述', '状态', 'Trace ID'];
    const csvRows = [headers.join(',')];

    data.forEach(log => {
      const row = [
        log.createdAt ? new Date(log.createdAt).toLocaleString('zh-CN') : '',
        log.userName || '',
        log.ipAddress || '',
        log.module || '',
        log.actionType || '',
        `"${(log.description || '').replace(/"/g, '""')}"`, // 转义双引号
        log.status || '',
        log.traceId || ''
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }
}
