import { Injectable, Logger } from '@nestjs/common';

/**
 * 数据库查询性能监控拦截器
 * 记录慢查询并提供性能分析
 */
@Injectable()
export class QueryPerformanceMonitor {
  private readonly logger = new Logger('QueryPerformance');
  private readonly slowQueryThreshold = 1000; // 慢查询阈值(毫秒)
  private queryStats = new Map<string, {
    count: number;
    totalTime: number;
    avgTime: number;
    maxTime: number;
    minTime: number;
  }>();

  /**
   * 监控查询执行
   */
  async monitor<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    params?: any,
  ): Promise<T> {
    const startTime = Date.now();
    let error: Error | null = null;

    try {
      const result = await queryFn();
      return result;
    } catch (err) {
      error = err;
      throw err;
    } finally {
      const duration = Date.now() - startTime;
      this.recordQuery(queryName, duration, error, params);
    }
  }

  /**
   * 记录查询统计
   */
  private recordQuery(
    queryName: string,
    duration: number,
    error: Error | null,
    params?: any,
  ): void {
    // 记录慢查询
    if (duration > this.slowQueryThreshold) {
      this.logger.warn(
        `Slow Query Detected: ${queryName} took ${duration}ms`,
        {
          queryName,
          duration,
          params: JSON.stringify(params),
          error: error?.message,
        },
      );
    }

    // 更新统计信息
    const stats = this.queryStats.get(queryName) || {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      maxTime: 0,
      minTime: Infinity,
    };

    stats.count++;
    stats.totalTime += duration;
    stats.avgTime = stats.totalTime / stats.count;
    stats.maxTime = Math.max(stats.maxTime, duration);
    stats.minTime = Math.min(stats.minTime, duration);

    this.queryStats.set(queryName, stats);
  }

  /**
   * 获取查询统计信息
   */
  getStats(): Map<string, any> {
    return this.queryStats;
  }

  /**
   * 获取慢查询列表
   */
  getSlowQueries(): Array<{ queryName: string; stats: any }> {
    const slowQueries = [];
    for (const [queryName, stats] of this.queryStats.entries()) {
      if (stats.avgTime > this.slowQueryThreshold) {
        slowQueries.push({ queryName, stats });
      }
    }
    return slowQueries.sort((a, b) => b.stats.avgTime - a.stats.avgTime);
  }

  /**
   * 重置统计信息
   */
  reset(): void {
    this.queryStats.clear();
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const lines = ['=== Database Query Performance Report ===\n'];

    // 总体统计
    let totalQueries = 0;
    let totalTime = 0;
    for (const stats of this.queryStats.values()) {
      totalQueries += stats.count;
      totalTime += stats.totalTime;
    }

    lines.push(`Total Queries: ${totalQueries}`);
    lines.push(`Total Time: ${totalTime}ms`);
    lines.push(`Average Time: ${(totalTime / totalQueries).toFixed(2)}ms\n`);

    // 慢查询
    const slowQueries = this.getSlowQueries();
    if (slowQueries.length > 0) {
      lines.push('=== Slow Queries ===');
      slowQueries.forEach(({ queryName, stats }) => {
        lines.push(
          `${queryName}: avg=${stats.avgTime.toFixed(2)}ms, max=${stats.maxTime}ms, count=${stats.count}`,
        );
      });
      lines.push('');
    }

    // Top 10 最频繁的查询
    const sortedByCount = Array.from(this.queryStats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);

    if (sortedByCount.length > 0) {
      lines.push('=== Top 10 Most Frequent Queries ===');
      sortedByCount.forEach(([queryName, stats]) => {
        lines.push(
          `${queryName}: count=${stats.count}, avg=${stats.avgTime.toFixed(2)}ms`,
        );
      });
    }

    return lines.join('\n');
  }
}
