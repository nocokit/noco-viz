import {
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * 业务异常基类
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    error?: any,
  ) {
    super(
      {
        statusCode,
        message,
        error,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

/**
 * 资源不存在异常
 */
export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, id?: number | string) {
    const message = id
      ? `${resource} #${id} 不存在`
      : `${resource}不存在`;
    super(message);
  }
}

/**
 * 资源已存在异常（冲突）
 */
export class ResourceExistsException extends ConflictException {
  constructor(resource: string, field?: string) {
    const message = field
      ? `${resource}的${field}已存在`
      : `${resource}已存在`;
    super(message);
  }
}

/**
 * 参数验证异常
 */
export class ValidationException extends BadRequestException {
  constructor(message: string = '参数验证失败', errors?: any) {
    super({
      message,
      errors,
    });
  }
}

/**
 * 权限不足异常
 */
export class PermissionDeniedException extends ForbiddenException {
  constructor(message: string = '权限不足，无法执行此操作') {
    super(message);
  }
}

/**
 * 认证失败异常
 */
export class AuthenticationException extends UnauthorizedException {
  constructor(message: string = '认证失败，请重新登录') {
    super(message);
  }
}

/**
 * Token 过期异常
 */
export class TokenExpiredException extends UnauthorizedException {
  constructor(message: string = 'Token已过期，请重新登录') {
    super(message);
  }
}

/**
 * 操作失败异常
 */
export class OperationFailedException extends BusinessException {
  constructor(operation: string, reason?: string) {
    const message = reason
      ? `${operation}失败: ${reason}`
      : `${operation}失败`;
    super(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 数据库操作异常
 */
export class DatabaseException extends InternalServerErrorException {
  constructor(message: string = '数据库操作失败', error?: any) {
    super({
      message,
      error: error?.message || error,
    });
  }
}

/**
 * 文件操作异常
 */
export class FileOperationException extends BusinessException {
  constructor(operation: string, reason?: string) {
    const message = reason
      ? `文件${operation}失败: ${reason}`
      : `文件${operation}失败`;
    super(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 外部服务异常
 */
export class ExternalServiceException extends BusinessException {
  constructor(service: string, reason?: string) {
    const message = reason
      ? `${service}服务异常: ${reason}`
      : `${service}服务异常`;
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

/**
 * 异常工厂类
 * 提供便捷的异常创建方法
 */
export class ExceptionFactory {
  /**
   * 资源不存在
   */
  static notFound(resource: string, id?: number | string) {
    return new ResourceNotFoundException(resource, id);
  }

  /**
   * 资源已存在
   */
  static exists(resource: string, field?: string) {
    return new ResourceExistsException(resource, field);
  }

  /**
   * 参数验证失败
   */
  static validation(message?: string, errors?: any) {
    return new ValidationException(message, errors);
  }

  /**
   * 权限不足
   */
  static permissionDenied(message?: string) {
    return new PermissionDeniedException(message);
  }

  /**
   * 认证失败
   */
  static authenticationFailed(message?: string) {
    return new AuthenticationException(message);
  }

  /**
   * Token过期
   */
  static tokenExpired(message?: string) {
    return new TokenExpiredException(message);
  }

  /**
   * 操作失败
   */
  static operationFailed(operation: string, reason?: string) {
    return new OperationFailedException(operation, reason);
  }

  /**
   * 数据库异常
   */
  static database(message?: string, error?: any) {
    return new DatabaseException(message, error);
  }

  /**
   * 文件操作异常
   */
  static fileOperation(operation: string, reason?: string) {
    return new FileOperationException(operation, reason);
  }

  /**
   * 外部服务异常
   */
  static externalService(service: string, reason?: string) {
    return new ExternalServiceException(service, reason);
  }

  /**
   * 业务异常
   */
  static business(message: string, statusCode?: HttpStatus) {
    return new BusinessException(message, statusCode);
  }
}

/**
 * 异常处理辅助函数
 */

/**
 * 断言条件为真，否则抛出异常
 */
export function assert(
  condition: boolean,
  exception: HttpException | string,
): asserts condition {
  if (!condition) {
    if (typeof exception === 'string') {
      throw new BusinessException(exception);
    }
    throw exception;
  }
}

/**
 * 断言值存在，否则抛出资源不存在异常
 */
export function assertExists<T>(
  value: T | null | undefined,
  resource: string,
  id?: number | string,
): asserts value is T {
  if (!value) {
    throw ExceptionFactory.notFound(resource, id);
  }
}

/**
 * 断言值不存在，否则抛出资源已存在异常
 */
export function assertNotExists<T>(
  value: T | null | undefined,
  resource: string,
  field?: string,
): asserts value is null | undefined {
  if (value) {
    throw ExceptionFactory.exists(resource, field);
  }
}

/**
 * 捕获并转换异常
 */
export async function catchAndThrow<T>(
  promise: Promise<T>,
  errorMessage: string,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    throw new BusinessException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR, error);
  }
}
