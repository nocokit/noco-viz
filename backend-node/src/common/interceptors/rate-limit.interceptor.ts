import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

/**
 * 接口限流拦截器
 * 使用滑动窗口算法实现限流
 */
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly timeout: number;

  constructor(options: { windowMs?: number; maxRequests?: number; timeout?: number } = {}) {
    this.windowMs = options.windowMs || 60000; // 默认1分钟
    this.maxRequests = options.maxRequests || 100; // 默认100次
    this.timeout = options.timeout || 30000; // 默认30秒超时
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = this.getKey(request);

    // 检查限流
    if (!this.checkRateLimit(key)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: '请求过于频繁,请稍后再试',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 记录请求
    this.recordRequest(key);

    // 定期清理过期记录
    this.cleanup();

    // 添加超时处理
    return next.handle().pipe(
      timeout(this.timeout),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: HttpStatus.REQUEST_TIMEOUT,
                  message: '请求超时',
                  error: 'Request Timeout',
                },
                HttpStatus.REQUEST_TIMEOUT,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }

  /**
   * 获取限流key(基于IP和用户ID)
   */
  private getKey(request: any): string {
    const ip = request.ip || request.connection.remoteAddress;
    const userId = request.user?.id || 'anonymous';
    return `${ip}:${userId}`;
  }

  /**
   * 检查是否超过限流
   */
  private checkRateLimit(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // 获取该key的请求记录
    const requests = this.requests.get(key) || [];

    // 过滤出时间窗口内的请求
    const recentRequests = requests.filter((time) => time > windowStart);

    // 检查是否超过限制
    return recentRequests.length < this.maxRequests;
  }

  /**
   * 记录请求
   */
  private recordRequest(key: string): void {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // 添加当前请求时间
    requests.push(now);

    // 只保留时间窗口内的请求
    const windowStart = now - this.windowMs;
    const recentRequests = requests.filter((time) => time > windowStart);

    this.requests.set(key, recentRequests);
  }

  /**
   * 清理过期记录
   */
  private cleanup(): void {
    // 每隔一段时间清理一次
    if (Math.random() > 0.99) {
      const now = Date.now();
      const windowStart = now - this.windowMs;

      for (const [key, requests] of this.requests.entries()) {
        const recentRequests = requests.filter((time) => time > windowStart);
        if (recentRequests.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, recentRequests);
        }
      }
    }
  }
}
