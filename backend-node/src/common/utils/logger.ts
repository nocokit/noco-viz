import { Logger as NestLogger, LogLevel } from '@nestjs/common';

/**
 * 日志级别枚举
 */
export enum LogLevelEnum {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

/**
 * 日志上下文接口
 */
export interface LogContext {
  userId?: number;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

/**
 * 增强的日志工具类
 * 提供结构化日志记录功能
 */
export class Logger {
  private logger: NestLogger;
  private context: string;
  private defaultContext: LogContext = {};

  constructor(context: string, defaultContext?: LogContext) {
    this.logger = new NestLogger(context);
    this.context = context;
    if (defaultContext) {
      this.defaultContext = defaultContext;
    }
  }

  /**
   * 设置默认上下文
   */
  setDefaultContext(context: LogContext) {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(message: string, context?: LogContext): string {
    const mergedContext = { ...this.defaultContext, ...context };
    const contextStr = Object.keys(mergedContext).length > 0
      ? ` | Context: ${JSON.stringify(mergedContext)}`
      : '';
    return `${message}${contextStr}`;
  }

  /**
   * 记录错误日志
   */
  error(message: string, trace?: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.error(formattedMessage, trace, this.context);
  }

  /**
   * 记录警告日志
   */
  warn(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.warn(formattedMessage, this.context);
  }

  /**
   * 记录信息日志
   */
  log(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.log(formattedMessage, this.context);
  }

  /**
   * 记录调试日志
   */
  debug(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.debug(formattedMessage, this.context);
  }

  /**
   * 记录详细日志
   */
  verbose(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.verbose(formattedMessage, this.context);
  }

  /**
   * 记录 HTTP 请求
   */
  logRequest(method: string, url: string, statusCode: number, responseTime: number, context?: LogContext) {
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;
    this.log(message, context);
  }

  /**
   * 记录数据库查询
   */
  logQuery(query: string, duration: number, context?: LogContext) {
    const message = `Query executed in ${duration}ms: ${query}`;
    this.debug(message, context);
  }

  /**
   * 记录业务操作
   */
  logOperation(operation: string, result: 'success' | 'failure', context?: LogContext) {
    const message = `Operation: ${operation} - Result: ${result}`;
    if (result === 'success') {
      this.log(message, context);
    } else {
      this.warn(message, context);
    }
  }

  /**
   * 记录性能指标
   */
  logPerformance(operation: string, duration: number, context?: LogContext) {
    const message = `Performance: ${operation} took ${duration}ms`;
    if (duration > 1000) {
      this.warn(message, context);
    } else {
      this.debug(message, context);
    }
  }
}

/**
 * 日志工厂类
 * 用于创建和管理日志实例
 */
export class LoggerFactory {
  private static loggers: Map<string, Logger> = new Map();

  /**
   * 获取或创建日志实例
   */
  static getLogger(context: string, defaultContext?: LogContext): Logger {
    if (!this.loggers.has(context)) {
      this.loggers.set(context, new Logger(context, defaultContext));
    }
    return this.loggers.get(context)!;
  }

  /**
   * 清除所有日志实例
   */
  static clearLoggers() {
    this.loggers.clear();
  }
}

/**
 * 日志装饰器
 * 自动记录方法调用
 */
export function LogMethod(level: LogLevelEnum = LogLevelEnum.DEBUG) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      const logger = LoggerFactory.getLogger(className);
      const startTime = Date.now();

      try {
        logger[level](`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;
        logger[level](`${propertyKey} completed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(
          `${propertyKey} failed after ${duration}ms`,
          error.stack,
        );
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 性能监控装饰器
 * 记录方法执行时间
 */
export function LogPerformance(threshold: number = 1000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      const logger = LoggerFactory.getLogger(className);
      const startTime = Date.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        if (duration > threshold) {
          logger.warn(
            `Performance warning: ${propertyKey} took ${duration}ms (threshold: ${threshold}ms)`,
          );
        } else {
          logger.debug(`${propertyKey} executed in ${duration}ms`);
        }

        return result;
      } catch (error) {
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 日志辅助函数
 */
export class LogHelper {
  /**
   * 格式化错误信息
   */
  static formatError(error: Error): string {
    return `${error.name}: ${error.message}\nStack: ${error.stack}`;
  }

  /**
   * 脱敏处理
   */
  static sanitize(data: any, sensitiveFields: string[] = ['password', 'token', 'secret']): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = Array.isArray(data) ? [...data] : { ...data };

    for (const key in sanitized) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = '***';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitize(sanitized[key], sensitiveFields);
      }
    }

    return sanitized;
  }

  /**
   * 截断长字符串
   */
  static truncate(str: string, maxLength: number = 100): string {
    if (str.length <= maxLength) {
      return str;
    }
    return `${str.substring(0, maxLength)}... (truncated)`;
  }
}

/**
 * 默认导出
 */
export default Logger;
