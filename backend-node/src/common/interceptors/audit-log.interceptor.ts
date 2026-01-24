import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from '../../modules/audit-log/audit-log.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, body, user, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const traceId = uuidv4();

    // 跳过审计日志接口本身，避免递归
    if (url.includes('/audit-logs')) {
      return next.handle();
    }

    // 跳过健康检查等接口
    if (url.includes('/health') || url.includes('/metrics')) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;

        // 记录成功的操作
        this.createAuditLog({
          request,
          response,
          user,
          ip,
          userAgent,
          traceId,
          status: 'success',
          responseStatus: response.statusCode,
          responseTime,
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;

        // 记录失败的操作
        this.createAuditLog({
          request,
          response,
          user,
          ip,
          userAgent,
          traceId,
          status: 'fail',
          error: error.message,
          responseStatus: error.status || 500,
          responseTime,
        });

        throw error;
      }),
    );
  }

  private async createAuditLog(params: any) {
    const { request, user, ip, userAgent, traceId, status, error, responseStatus } = params;
    const { method, url, body } = request;

    // 解析模块和操作
    const { module, action, actionType, description } = this.parseRequestInfo(method, url, body);

    try {
      await this.auditLogService.create({
        userId: user?.sub || user?.id,
        userName: user?.username || user?.email || 'Unknown',
        ipAddress: ip || request.connection?.remoteAddress || 'Unknown',
        userAgent,
        module,
        action,
        actionType,
        description,
        requestMethod: method,
        requestUrl: url,
        requestBody: this.sanitizeBody(body),
        responseStatus,
        error,
        status,
        traceId,
      });
    } catch (err) {
      // 静默失败，不影响主业务
      console.error('Failed to create audit log:', err);
    }
  }

  private parseRequestInfo(method: string, url: string, body: any) {
    // 使用配置驱动的模块映射
    const { parseModuleInfo } = require('../audit/module-mapper');
    return parseModuleInfo(method, url, body);
  }

  private sanitizeBody(body: any): string {
    if (!body) return '';

    try {
      const sanitized = { ...body };

      // 移除敏感信息
      const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'accessToken', 'refreshToken'];
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '***';
        }
      });

      return JSON.stringify(sanitized);
    } catch (err) {
      return '';
    }
  }
}
