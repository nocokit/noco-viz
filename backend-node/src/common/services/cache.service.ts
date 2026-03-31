import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Redis缓存服务
 * 提供统一的缓存接口
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private cache: Map<string, { data: any; expireAt: number }> = new Map();
  private readonly defaultTTL = 300; // 默认5分钟

  constructor(private configService: ConfigService) {
    // 定期清理过期缓存
    setInterval(() => this.cleanup(), 60000); // 每分钟清理一次
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > item.expireAt) {
      this.cache.delete(key);
      return null;
    }

    this.logger.debug(`Cache hit: ${key}`);
    return item.data as T;
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    const expireAt = Date.now() + ttl * 1000;
    this.cache.set(key, { data: value, expireAt });
    this.logger.debug(`Cache set: ${key}, TTL: ${ttl}s`);
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    this.cache.delete(key);
    this.logger.debug(`Cache deleted: ${key}`);
  }

  /**
   * 批量删除缓存(支持通配符)
   */
  async delPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    const keysToDelete = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.logger.debug(`Cache pattern deleted: ${pattern}, count: ${keysToDelete.length}`);
  }

  /**
   * 检查缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expireAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 获取或设置缓存
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.defaultTTL,
  ): Promise<T> {
    // 尝试从缓存获取
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 缓存未命中,执行工厂函数
    const value = await factory();

    // 存入缓存
    await this.set(key, value, ttl);

    return value;
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expireAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.logger.log('All cache cleared');
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * 缓存装饰器
 * 自动缓存方法返回值
 */
export function Cacheable(options: {
  key?: string;
  ttl?: number;
  keyGenerator?: (...args: any[]) => string;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService: CacheService = this.cacheService;

      if (!cacheService) {
        // 如果没有注入CacheService,直接执行原方法
        return originalMethod.apply(this, args);
      }

      // 生成缓存key
      let cacheKey: string;
      if (options.keyGenerator) {
        cacheKey = options.keyGenerator(...args);
      } else if (options.key) {
        cacheKey = options.key;
      } else {
        cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      }

      // 尝试从缓存获取
      const cached = await cacheService.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // 执行原方法
      const result = await originalMethod.apply(this, args);

      // 存入缓存
      await cacheService.set(cacheKey, result, options.ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * 缓存失效装饰器
 * 方法执行后自动清除相关缓存
 */
export function CacheEvict(options: {
  key?: string;
  pattern?: string;
  allEntries?: boolean;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      const cacheService: CacheService = this.cacheService;
      if (!cacheService) {
        return result;
      }

      // 清除缓存
      if (options.allEntries) {
        await cacheService.clear();
      } else if (options.pattern) {
        await cacheService.delPattern(options.pattern);
      } else if (options.key) {
        await cacheService.del(options.key);
      }

      return result;
    };

    return descriptor;
  };
}
