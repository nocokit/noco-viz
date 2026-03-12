import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  @ApiOperation({ summary: '创建审计日志（系统内部使用）' })
  create(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogService.create(createAuditLogDto);
  }

  @Get()
  @ApiOperation({ summary: '获取审计日志列表' })
  findAll(@Query() queryDto: QueryAuditLogDto) {
    return this.auditLogService.findAll(queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取审计日志统计信息' })
  getStatistics() {
    return this.auditLogService.getStatistics();
  }

  @Get('export')
  @ApiOperation({ summary: '导出审计日志' })
  async export(@Query() queryDto: QueryAuditLogDto, @Res() res: Response) {
    const csvContent = await this.auditLogService.export(queryDto);

    // 添加 BOM 以支持中文
    const bom = '\uFEFF';
    const content = bom + csvContent;

    // 设置响应头
    const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

    return res.send(content);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单条审计日志详情' })
  async findOne(@Param('id') id: string) {
    const log = await this.auditLogService.findOne(+id);
    if (!log) {
      throw new NotFoundException(`审计日志 #${id} 不存在`);
    }
    return log;
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除审计日志（谨慎使用）' })
  remove(@Param('id') id: string) {
    return this.auditLogService.remove(+id);
  }
}
