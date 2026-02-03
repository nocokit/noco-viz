import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * 全局日志拦截器
 * 记录所有请求和响应
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const userId = request.user?.id || 'anonymous';

    const now = Date.now();

    // 记录请求
    this.logger.log(
      `[Request] ${method} ${url} - User: ${userId} - IP: ${ip} - UA: ${userAgent}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - now;

        // 记录响应
        this.logger.log(
          `[Response] ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;

        // 记录错误
        this.logger.error(
          `[Error] ${method} ${url} - Duration: ${duration}ms - Error: ${error.message}`,
          error.stack,
        );

        return throwError(() => error);
      }),
    );
  }
}
