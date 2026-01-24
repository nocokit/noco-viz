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
 * 统一处理所有异常，返回标准格式的错误响应
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: any = null;

    // 处理 HTTP 异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || error;
        details = responseObj.details || responseObj.errors || null;
      }
    } else if (exception instanceof Error) {
      // 处理普通错误
      message = exception.message;
      error = exception.name;

      // 记录堆栈信息
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    } else {
      // 处理未知异常
      message = 'Unknown error occurred';
      this.logger.error('Unknown exception:', exception);
    }

    // 构建错误响应
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      ...(details && { details }),
    };

    // 开发环境下添加堆栈信息
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      (errorResponse as any).stack = exception.stack;
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
    );

    // 返回错误响应
    response.status(status).json(errorResponse);
  }
}

/**
 * HTTP 异常过滤器
 * 专门处理 HTTP 异常，提供更友好的错误信息
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];
    let error: string;
    let details: any = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = HttpStatus[status];
    } else {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || 'Error occurred';
      error = responseObj.error || HttpStatus[status];
      details = responseObj.details || responseObj.errors || null;
    }

    // 构建标准错误响应
    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: Array.isArray(message) ? message : [message],
      error,
      ...(details && { details }),
    };

    // 记录错误日志（4xx 级别�� warn，5xx 级别用 error）
    const logLevel = status >= 500 ? 'error' : 'warn';
    this.logger[logLevel](
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}

/**
 * 验证异常过滤器
 * 专门处理 class-validator 的验证错误
 */
@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 检查是否是验证错误
    if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.BAD_REQUEST
    ) {
      const exceptionResponse: any = exception.getResponse();

      // 格式化验证错误
      if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
        const validationErrors = exceptionResponse.message.map((msg: string) => {
          // 提取字段名和错误信息
          const match = msg.match(/^(\w+)\s+(.+)$/);
          if (match) {
            return {
              field: match[1],
              message: match[2],
            };
          }
          return { message: msg };
        });

        response.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          message: '参数验证失败',
          error: 'Validation Error',
          details: validationErrors,
        });
        return;
      }
    }

    // 如果不是验证错误，传递给下一个过滤器
    throw exception;
  }
}
