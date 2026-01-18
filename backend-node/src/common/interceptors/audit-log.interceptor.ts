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
    let module = '未知模块';
    let action = '操作';
    let actionType = 'other';
    let description = `${method} ${url}`;

    // 解析 URL 获取模块信息
    if (url.includes('/auth/login')) {
      module = '系统登录';
      action = '登录';
      actionType = 'login';
      description = `用户登录: ${body?.username || body?.email || ''}`;
    } else if (url.includes('/auth/logout')) {
      module = '系统登录';
      action = '登出';
      actionType = 'logout';
      description = '用户登出';
    } else if (url.includes('/auth/register')) {
      module = '用户管理';
      action = '注册';
      actionType = 'create';
      description = `注册新用户: ${body?.username || body?.email || ''}`;
    } else if (url.includes('/users')) {
      module = '用户管理';
      if (method === 'POST') {
        action = '新建';
        actionType = 'create';
        description = `创建用户: ${body?.username || body?.email || ''}`;
      } else if (method === 'PUT' || method === 'PATCH') {
        action = '更新';
        actionType = 'update';
        description = `更新用户信息`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除用户`;
      }
    } else if (url.includes('/roles')) {
      module = '角色管理';
      if (method === 'POST') {
        action = '新建';
        actionType = 'create';
        description = `创建角色: ${body?.name || ''}`;
      } else if (method === 'PUT' || method === 'PATCH') {
        action = '更新';
        actionType = 'update';
        description = `更新角色: ${body?.name || ''}`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除角色`;
      }
    } else if (url.includes('/projects')) {
      module = '项目管理';
      if (method === 'POST') {
        action = '新建';
        actionType = 'create';
        description = `创建项目: ${body?.name || ''}`;
      } else if (method === 'PUT' || method === 'PATCH') {
        action = '更新';
        actionType = 'update';
        description = `更新项目: ${body?.name || ''}`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除项目`;
      }
    } else if (url.includes('/datasets') || url.includes('/connections')) {
      module = '数据源管理';
      if (method === 'POST') {
        action = '新建';
        actionType = 'create';
        description = `创建数据源: ${body?.name || ''}`;
      } else if (method === 'PUT' || method === 'PATCH') {
        action = '更新';
        actionType = 'update';
        description = `更新数据源: ${body?.name || ''}`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除数据源`;
      }
    } else if (url.includes('/templates')) {
      module = '模板管理';
      if (method === 'POST') {
        action = '新建';
        actionType = 'create';
        description = `创建模板: ${body?.name || ''}`;
      } else if (method === 'PUT' || method === 'PATCH') {
        action = '更新';
        actionType = 'update';
        description = `更新模板: ${body?.name || ''}`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除模板`;
      }
    } else if (url.includes('/system-config')) {
      module = '系统设置';
      action = '更新';
      actionType = 'update';
      description = '修改系统配置';
    } else if (url.includes('/ip-whitelist')) {
      module = 'IP白名单';
      if (method === 'POST') {
        action = '新建';
        actionType = 'create';
        description = `添加IP白名单: ${body?.ip || ''}`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除IP白名单`;
      }
    } else if (url.includes('/backup')) {
      module = '备份管理';
      if (method === 'POST') {
        action = '创建备份';
        actionType = 'create';
        description = '创建系统备份';
      } else if (url.includes('/restore')) {
        action = '恢复备份';
        actionType = 'update';
        description = '恢复系统备份';
      }
    } else if (url.includes('/media')) {
      module = '媒体管理';
      if (method === 'POST') {
        action = '上传';
        actionType = 'create';
        description = `上传媒体文件`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除媒体文件`;
      }
    } else if (url.includes('/playlists')) {
      module = '播放列表';
      if (method === 'POST') {
        action = '新建';
        actionType = 'create';
        description = `创建播放列表: ${body?.name || ''}`;
      } else if (method === 'PUT' || method === 'PATCH') {
        action = '更新';
        actionType = 'update';
        description = `更新播放列表`;
      } else if (method === 'DELETE') {
        action = '删除';
        actionType = 'delete';
        description = `删除播放列表`;
      }
    }

    return { module, action, actionType, description };
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
