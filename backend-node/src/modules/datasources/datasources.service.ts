import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Datasource, DatasourceType, DatasourceStatus } from './entities/datasource.entity';
import { CreateDatasourceDto } from './dto/create-datasource.dto';
import { UpdateDatasourceDto } from './dto/update-datasource.dto';
import { TestConnectionDto } from './dto/test-connection.dto';
import * as mysql from 'mysql2/promise';
import { Client as PgClient } from 'pg';
import { MongoClient } from 'mongodb';
import * as crypto from 'crypto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DatasourcesService {
  private readonly logger = new Logger(DatasourcesService.name);
  private connectionPools: Map<number, any> = new Map();

  constructor(
    @InjectRepository(Datasource)
    private datasourceRepository: Repository<Datasource>,
  ) {}

  // 定时健康检查（每5分钟）
  @Cron(CronExpression.EVERY_5_MINUTES)
  async healthCheck() {
    this.logger.log('开始数据源健康检查...');
    const datasources = await this.datasourceRepository.find({
      where: { status: DatasourceStatus.ACTIVE },
    });

    for (const datasource of datasources) {
      try {
        await this.testSavedConnection(datasource.id);
      } catch (error) {
        this.logger.error(`数据源 ${datasource.name} 健康检查失败: ${error.message}`);
      }
    }
    this.logger.log('数据源健康检查完成');
  }

  // 加密敏感信息
  private encryptPassword(password: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default-32-character-key-here!!', 'utf8');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // 解密敏感信息
  private decryptPassword(encryptedPassword: string): string {
    try {
      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default-32-character-key-here!!', 'utf8');
      const parts = encryptedPassword.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      return encryptedPassword;
    }
  }

  async create(createDatasourceDto: CreateDatasourceDto, userId: number): Promise<Datasource> {
    // 加密密码
    if (createDatasourceDto.config.password) {
      createDatasourceDto.config.password = this.encryptPassword(createDatasourceDto.config.password);
    }

    const datasource = this.datasourceRepository.create({
      ...createDatasourceDto,
      createdById: userId,
    });

    return await this.datasourceRepository.save(datasource);
  }

  async findAll(userId?: number): Promise<Datasource[]> {
    const query = this.datasourceRepository.createQueryBuilder('datasource')
      .leftJoinAndSelect('datasource.createdBy', 'user')
      .orderBy('datasource.createdAt', 'DESC');

    if (userId) {
      query.where('datasource.createdById = :userId', { userId });
    }

    const datasources = await query.getMany();

    // 隐藏密码
    return datasources.map(ds => ({
      ...ds,
      config: {
        ...ds.config,
        password: ds.config.password ? '******' : undefined,
      },
    }));
  }

  async findOne(id: number): Promise<Datasource> {
    const datasource = await this.datasourceRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!datasource) {
      throw new NotFoundException(`数据源 #${id} 不存在`);
    }

    // 隐藏密码
    return {
      ...datasource,
      config: {
        ...datasource.config,
        password: datasource.config.password ? '******' : undefined,
      },
    };
  }

  async update(id: number, updateDatasourceDto: UpdateDatasourceDto): Promise<Datasource> {
    const datasource = await this.datasourceRepository.findOne({ where: { id } });

    if (!datasource) {
      throw new NotFoundException(`数据源 #${id} 不存在`);
    }

    // 如果更新了密码，进行加密
    if (updateDatasourceDto.config?.password && updateDatasourceDto.config.password !== '******') {
      updateDatasourceDto.config.password = this.encryptPassword(updateDatasourceDto.config.password);
    } else if (updateDatasourceDto.config?.password === '******') {
      // 如果密码是 ******，保持原密码不变
      delete updateDatasourceDto.config.password;
    }

    Object.assign(datasource, updateDatasourceDto);
    return await this.datasourceRepository.save(datasource);
  }

  async remove(id: number): Promise<void> {
    const datasource = await this.datasourceRepository.findOne({ where: { id } });

    if (!datasource) {
      throw new NotFoundException(`数据源 #${id} 不存在`);
    }

    await this.datasourceRepository.remove(datasource);
  }

  // 测试连接
  async testConnection(testConnectionDto: TestConnectionDto): Promise<{ success: boolean; message: string; latency?: number }> {
    const startTime = Date.now();

    try {
      switch (testConnectionDto.type) {
        case DatasourceType.MYSQL:
          return await this.testMySQLConnection(testConnectionDto.config, startTime);
        case DatasourceType.POSTGRESQL:
          return await this.testPostgreSQLConnection(testConnectionDto.config, startTime);
        case DatasourceType.MONGODB:
          return await this.testMongoDBConnection(testConnectionDto.config, startTime);
        case DatasourceType.RESTAPI:
          return await this.testRESTAPIConnection(testConnectionDto.config, startTime);
        default:
          throw new BadRequestException('不支持的数据源类型');
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        latency: Date.now() - startTime,
      };
    }
  }

  // 测试已保存的数据源连接
  async testSavedConnection(id: number): Promise<{ success: boolean; message: string; latency?: number }> {
    const datasource = await this.datasourceRepository.findOne({ where: { id } });

    if (!datasource) {
      throw new NotFoundException(`数据源 #${id} 不存在`);
    }

    // 解密密码
    const config = { ...datasource.config };
    if (config.password) {
      config.password = this.decryptPassword(config.password);
    }

    const result = await this.testConnection({
      type: datasource.type,
      config,
    });

    // 更新测试结果
    datasource.lastTestAt = new Date();
    datasource.lastTestResult = result.message;
    datasource.status = result.success ? DatasourceStatus.ACTIVE : DatasourceStatus.ERROR;
    await this.datasourceRepository.save(datasource);

    return result;
  }

  private async testMySQLConnection(config: any, startTime: number): Promise<{ success: boolean; message: string; latency: number }> {
    let connection;
    try {
      connection = await mysql.createConnection({
        host: config.host,
        port: config.port || 3306,
        user: config.username,
        password: config.password,
        database: config.database,
        connectTimeout: 5000,
      });

      await connection.ping();
      const latency = Date.now() - startTime;

      return {
        success: true,
        message: '连接成功',
        latency,
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  private async testPostgreSQLConnection(config: any, startTime: number): Promise<{ success: boolean; message: string; latency: number }> {
    const client = new PgClient({
      host: config.host,
      port: config.port || 5432,
      user: config.username,
      password: config.password,
      database: config.database,
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      await client.query('SELECT 1');
      const latency = Date.now() - startTime;

      return {
        success: true,
        message: '连接成功',
        latency,
      };
    } finally {
      await client.end();
    }
  }

  private async testMongoDBConnection(config: any, startTime: number): Promise<{ success: boolean; message: string; latency: number }> {
    const client = new MongoClient(config.url, {
      serverSelectionTimeoutMS: 5000,
    });

    try {
      await client.connect();
      await client.db().admin().ping();
      const latency = Date.now() - startTime;

      return {
        success: true,
        message: '连接成功',
        latency,
      };
    } finally {
      await client.close();
    }
  }

  private async testRESTAPIConnection(config: any, startTime: number): Promise<{ success: boolean; message: string; latency: number }> {
    const response = await fetch(config.url, {
      method: 'GET',
      headers: config.headers || {},
      signal: AbortSignal.timeout(5000),
    });

    const latency = Date.now() - startTime;

    if (response.ok) {
      return {
        success: true,
        message: `连接成功 (HTTP ${response.status})`,
        latency,
      };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // 获取数据源统计信息
  async getDatasourceStats() {
    const [total, active, inactive, error] = await Promise.all([
      this.datasourceRepository.count(),
      this.datasourceRepository.count({ where: { status: DatasourceStatus.ACTIVE } }),
      this.datasourceRepository.count({ where: { status: DatasourceStatus.INACTIVE } }),
      this.datasourceRepository.count({ where: { status: DatasourceStatus.ERROR } }),
    ]);

    // 按类型统计
    const typeStats = await this.datasourceRepository
      .createQueryBuilder('datasource')
      .select('datasource.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('datasource.type')
      .getRawMany();

    return {
      total,
      byStatus: {
        active,
        inactive,
        error,
      },
      byType: typeStats.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  // 获取数据源健康状态
  async getHealthStatus() {
    const datasources = await this.datasourceRepository.find({
      select: ['id', 'name', 'type', 'status', 'lastTestAt', 'lastTestResult'],
      order: { lastTestAt: 'DESC' },
    });

    return datasources.map(ds => ({
      id: ds.id,
      name: ds.name,
      type: ds.type,
      status: ds.status,
      lastTestAt: ds.lastTestAt,
      lastTestResult: ds.lastTestResult,
      isHealthy: ds.status === DatasourceStatus.ACTIVE,
    }));
  }

  // 批量测试连接
  async batchTestConnections(ids: number[]) {
    const results = [];

    for (const id of ids) {
      try {
        const result = await this.testSavedConnection(id);
        results.push({
          id,
          success: result.success,
          message: result.message,
          latency: result.latency,
        });
      } catch (error) {
        results.push({
          id,
          success: false,
          message: error.message,
          latency: 0,
        });
      }
    }

    return results;
  }
}
