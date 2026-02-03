import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueryPerformanceMonitor } from './utils/query-performance-monitor.util';

/**
 * 数据库配置模块
 * 提供优化的数据库连接池配置
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'admin123'),
        database: configService.get('DB_DATABASE', 'nocoviz'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('DB_LOGGING', false),

        // 连接池优化配置
        extra: {
          // 连接池大小
          connectionLimit: 20, // 最大连接数

          // 连接超时
          connectTimeout: 10000, // 10秒
          acquireTimeout: 10000, // 获取连接超时

          // 空闲连接管理
          idleTimeoutMillis: 30000, // 空闲连接30秒后释放

          // 连接验证
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,

          // 查询超时
          timeout: 30000, // 30秒

          // 字符集
          charset: 'utf8mb4',

          // 时区
          timezone: '+08:00',

          // 连接池队列限制
          queueLimit: 0, // 无限制

          // 等待连接
          waitForConnections: true,

          // 调试模式
          debug: configService.get('NODE_ENV') === 'development',
        },

        // 连接池配置
        poolSize: 20,

        // 缓存配置
        cache: {
          type: 'database',
          duration: 60000, // 缓存1分钟
          tableName: 'query_result_cache',
        },

        // 最大查询执行时间
        maxQueryExecutionTime: 5000, // 5秒,超过会记录警告
      }),
    }),
  ],
  providers: [QueryPerformanceMonitor],
  exports: [QueryPerformanceMonitor],
})
export class DatabaseModule {}
