import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 标准响应格式接口
 */
export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

/**
 * 响应转换拦截器
 * 将所有成功的响应转换为统一格式
 */
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

/**
 * 分页响应格式接口
 */
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

/**
 * 分页响应拦截器
 * 处理分页数据的统一格式
 */
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
        // 检查是否是分页响应
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

        // 如果不是分页响应，返回标准格式
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

/**
 * 日志拦截器
 * 记录请求和响应信息
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    console.log(`[Request] ${method} ${url}`);
    console.log('Body:', body);
    console.log('Query:', query);
    console.log('Params:', params);

    return next.handle().pipe(
      map((data) => {
        const responseTime = Date.now() - now;
        console.log(`[Response] ${method} ${url} - ${responseTime}ms`);
        return data;
      }),
    );
  }
}

/**
 * 缓存拦截器
 * 为 GET 请求添加缓存控制
 */
@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  constructor(private readonly maxAge: number = 300) {} // 默认5分钟

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // 只对 GET 请求添加缓存
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
