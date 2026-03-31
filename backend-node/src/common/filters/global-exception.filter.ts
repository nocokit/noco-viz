import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 全局异常过滤器
 * 统一处理所有异常并返回标准格式
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定HTTP状态码
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 提取错误信息
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 构造错误响应
    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // 记录错误日志
    if (status >= 500) {
      // 服务器错误,记录完整堆栈
      this.logger.error(
        `[${request.method}] ${request.url} - Status: ${status}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else {
      // 客户端错误,只记录基本信息
      this.logger.warn(
        `[${request.method}] ${request.url} - Status: ${status} - Message: ${message}`,
      );
    }

    // 发送响应
    response.status(status).json(errorResponse);
  }
}
