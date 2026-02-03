import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  timestamp: string;
  path: string;
}

@Injectable()
export class PaginationInterceptor<T>
  implements NestInterceptor<any, PaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          'total' in response
        ) {
          const { data, total, page = 1, pageSize = 20, totalPages } = response;

          return {
            success: true,
            data,
            pagination: {
              total,
              page: Number(page),
              pageSize: Number(pageSize),
              totalPages: totalPages || Math.ceil(total / pageSize),
            },
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        return {
          success: true,
          data: response,
          pagination: {
            total: Array.isArray(response) ? response.length : 1,
            page: 1,
            pageSize: Array.isArray(response) ? response.length : 1,
            totalPages: 1,
          },
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  constructor(private readonly maxAge: number = 300) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (request.method === 'GET') {
      response.setHeader('Cache-Control', `public, max-age=${this.maxAge}`);
    } else {
      response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    return next.handle();
  }
}

/**
 * 超时拦截器
 * 为请求添加超时控制
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeout: number = 30000) {} // 默认30秒

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { timeout } = require('rxjs/operators');
    return next.handle().pipe(timeout(this.timeout));
  }
}

/**
 * 响应格式化工具函数
 */
export class ResponseFormatter {
  /**
   * 成功响应
   */
  static success<T>(data: T, message?: string): Response<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      path: '',
    };
  }

  /**
   * 分页响应
   */
  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
  ): PaginatedResponse<T> {
    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      timestamp: new Date().toISOString(),
      path: '',
    };
  }

  /**
   * 列表响应
   */
  static list<T>(data: T[], message?: string): Response<T[]> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      path: '',
    };
  }

  /**
   * 创建成功响应
   */
  static created<T>(data: T, message = '创建成功'): Response<T> {
    return this.success(data, message);
  }

  /**
   * 更新成功响应
   */
  static updated<T>(data: T, message = '更新成功'): Response<T> {
    return this.success(data, message);
  }

  /**
   * 删除成功响应
   */
  static deleted(message = '删除成功'): Response<null> {
    return {
      success: true,
      data: null,
      message,
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}
