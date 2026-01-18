import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
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
    return await this.auditLogRepository.findOne({ where: { id } });
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
}
