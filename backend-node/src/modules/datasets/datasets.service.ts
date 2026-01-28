import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Dataset } from './entities/dataset.entity';
import { Connection } from './entities/connection.entity';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { UpdateDatasetDto } from './dto/update-dataset.dto';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import axios from 'axios';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectRepository(Dataset)
    private datasetsRepository: Repository<Dataset>,
    @InjectRepository(Connection)
    private connectionsRepository: Repository<Connection>,
    private dataSource: DataSource,
  ) {}

  // Dataset methods
  async createDataset(createDatasetDto: CreateDatasetDto, userId: number): Promise<Dataset> {
    const dataset = this.datasetsRepository.create({
      ...createDatasetDto,
      createdById: userId,
    });
    return this.datasetsRepository.save(dataset);
  }

  async findAllDatasets(): Promise<Dataset[]> {
    return this.datasetsRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneDataset(id: number): Promise<Dataset> {
    const dataset = await this.datasetsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!dataset) {
      throw new NotFoundException(`数据集 #${id} 不存在`);
    }

    return dataset;
  }

  async updateDataset(id: number, updateDatasetDto: UpdateDatasetDto): Promise<Dataset> {
    const dataset = await this.findOneDataset(id);
    Object.assign(dataset, updateDatasetDto);
    return this.datasetsRepository.save(dataset);
  }

  async removeDataset(id: number): Promise<void> {
    const dataset = await this.findOneDataset(id);
    await this.datasetsRepository.remove(dataset);
  }

  // Connection methods
  async createConnection(createConnectionDto: CreateConnectionDto, userId: number): Promise<Connection> {
    const connection = this.connectionsRepository.create({
      ...createConnectionDto,
      createdById: userId,
    });
    return this.connectionsRepository.save(connection);
  }

  async findAllConnections(): Promise<Connection[]> {
    return this.connectionsRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneConnection(id: number): Promise<Connection> {
    const connection = await this.connectionsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!connection) {
      throw new NotFoundException(`连接 #${id} 不存在`);
    }

    return connection;
  }

  async updateConnection(id: number, updateConnectionDto: UpdateConnectionDto): Promise<Connection> {
    const connection = await this.findOneConnection(id);
    Object.assign(connection, updateConnectionDto);
    return this.connectionsRepository.save(connection);
  }

  async removeConnection(id: number): Promise<void> {
    const connection = await this.findOneConnection(id);
    await this.connectionsRepository.remove(connection);
  }

  async testConnection(id: number): Promise<{ success: boolean; message: string }> {
    const connection = await this.findOneConnection(id);
    return this.testConnectionConfig({
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: connection.getDecryptedPassword(),
    });
  }

  async testConnectionConfig(config: any): Promise<{ success: boolean; message: string }> {
    try {
      switch (config.type) {
        case 'mysql':
          const mysql = require('mysql2/promise');
          const testConnection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.username,
            password: config.password,
          });
          await testConnection.query('SELECT 1');
          await testConnection.end();
          break;

        case 'postgresql':
          // PostgreSQL connection test would go here
          throw new BadRequestException('PostgreSQL 支持即将推出');

        case 'sqlserver':
          // SQL Server connection test would go here
          throw new BadRequestException('SQL Server 支持即将推出');

        case 'oracle':
          // Oracle connection test would go here
          throw new BadRequestException('Oracle 支持即将推出');

        default:
          throw new BadRequestException('不支持的数据库类型');
      }

      return {
        success: true,
        message: '连接成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '连接失败',
      };
    }
  }

  async previewDataset(id: number, page: number = 1, pageSize: number = 100): Promise<any> {
    const dataset = await this.findOneDataset(id);

    try {
      let data = [];
      let total = 0;
      let fields = dataset.fields || [];

      switch (dataset.type) {
        case 'sql':
          // SQL 数据集
          if (dataset.config?.connectionId && dataset.config?.sql) {
            const connection = await this.findOneConnection(dataset.config.connectionId);
            const result = await this.executeSQLQuery(
              connection,
              dataset.config.sql,
              page,
              pageSize,
            );
            data = result.data;
            total = result.total;
            fields = result.fields;
          }
          break;

        case 'api':
          // API 数据集
          if (dataset.config?.url) {
            const result = await this.fetchAPIData(dataset.config, page, pageSize);
            data = result.data;
            total = result.total;
            fields = result.fields;
          }
          break;

        case 'excel':
          // Excel 数据集
          if (dataset.config?.data) {
            // Excel 数据已经在上传时解析并存储
            // 这里从存储中读取
            data = dataset.config.data || [];
            total = data.length;
            fields = dataset.fields || [];

            // 分页
            const start = (page - 1) * pageSize;
            data = data.slice(start, start + pageSize);
          }
          break;

        default:
          throw new BadRequestException('不支持的数据集类型');
      }

      return {
        data,
        total,
        page,
        pageSize,
        fields,
      };
    } catch (error) {
      throw new BadRequestException(`预览数据失败: ${error.message}`);
    }
  }

  private async executeSQLQuery(
    connection: Connection,
    sql: string,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number; fields: any[] }> {
    let mysqlConnection;
    try {
      switch (connection.type) {
        case 'mysql':
          const mysql = require('mysql2/promise');
          mysqlConnection = await mysql.createConnection({
            host: connection.host,
            port: connection.port,
            database: connection.database,
            user: connection.username,
            password: connection.getDecryptedPassword(),
          });

          // 获取总数 - 使用参数化查询
          const countSql = `SELECT COUNT(*) as total FROM (${sql}) as count_table`;
          const [countResult] = await mysqlConnection.query(countSql);
          const total = countResult[0].total;

          // 分页查询 - 使用参数化查询
          const offset = (page - 1) * pageSize;
          const paginatedSql = `${sql} LIMIT ? OFFSET ?`;
          const [rows, fieldInfo] = await mysqlConnection.query(paginatedSql, [pageSize, offset]);

          // 提取字段信息
          const fields = fieldInfo.map((field) => ({
            name: field.name,
            type: field.type,
          }));

          return { data: rows, total, fields };

        default:
          throw new BadRequestException('暂不支持该数据库类型的查询');
      }
    } catch (error) {
      throw new BadRequestException(`SQL 查询失败: ${error.message}`);
    } finally {
      if (mysqlConnection) {
        await mysqlConnection.end();
      }
    }
  }

  private async fetchAPIData(
    config: any,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number; fields: any[] }> {
    try {
      const { url, method = 'GET', headers = {}, params = {}, body = {} } = config;

      // 添加分页参���
      const requestParams = {
        ...params,
        page,
        pageSize,
      };

      const response = await axios({
        url,
        method,
        headers,
        params: method === 'GET' ? requestParams : params,
        data: method !== 'GET' ? { ...body, page, pageSize } : undefined,
        timeout: 30000,
      });

      let data = response.data;
      let total = 0;
      let fields = [];

      // 处理不同的响应格式
      if (config.dataPath) {
        // 如果配置了数据路径，从响应中提取数据
        const paths = config.dataPath.split('.');
        for (const path of paths) {
          data = data[path];
        }
      }

      if (Array.isArray(data)) {
        total = data.length;
        // 从第一条数据提取字段
        if (data.length > 0) {
          fields = Object.keys(data[0]).map((key) => ({
            name: key,
            type: typeof data[0][key],
          }));
        }
      } else if (data.data && Array.isArray(data.data)) {
        // 标准分页格式
        total = data.total || data.data.length;
        data = data.data;
        if (data.length > 0) {
          fields = Object.keys(data[0]).map((key) => ({
            name: key,
            type: typeof data[0][key],
          }));
        }
      }

      return { data, total, fields };
    } catch (error) {
      throw new BadRequestException(`API 请求失败: ${error.message}`);
    }
  }

  async uploadExcel(file: Express.Multer.File): Promise<{ id: number; name: string; rowCount: number }> {
    // 1. 验证文件类型
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedExtensions = ['.xls', '.xlsx'];
    const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

    if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('不支持的文件类型，仅支持 Excel 文件（.xls, .xlsx）');
    }

    // 2. 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小超过限制（最大 10MB）');
    }

    try {
      // 安装 xlsx 包: npm install xlsx
      const XLSX = require('xlsx');

      // 解析 Excel 文件
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      return {
        id: Date.now(),
        name: file.originalname,
        rowCount: data.length,
      };
    } catch (error) {
      // 如果 xlsx 包未安装，返回提示
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new BadRequestException('Excel 解析功能需要安装 xlsx 包: npm install xlsx');
      }
      throw new BadRequestException(`Excel 文件解析失败: ${error.message}`);
    }
  }

  async validateSQL(sql: string, connectionId: number): Promise<{ valid: boolean; error?: string; fields?: any[] }> {
    let mysqlConnection;
    try {
      const connection = await this.findOneConnection(connectionId);

      switch (connection.type) {
        case 'mysql':
          const mysql = require('mysql2/promise');
          mysqlConnection = await mysql.createConnection({
            host: connection.host,
            port: connection.port,
            database: connection.database,
            user: connection.username,
            password: connection.getDecryptedPassword(),
          });

          // 使用 EXPLAIN 验证 SQL 语法
          try {
            const [rows, fieldInfo] = await mysqlConnection.query(`EXPLAIN ${sql}`);

            // 获取字段信息
            const [sampleRows, sampleFields] = await mysqlConnection.query(`${sql} LIMIT 1`);
            const fields = sampleFields.map((field) => ({
              name: field.name,
              type: this.mapMySQLType(field.type),
            }));

            return {
              valid: true,
              fields,
            };
          } catch (error) {
            return {
              valid: false,
              error: error.message,
            };
          }

        default:
          throw new BadRequestException('暂不支持该数据库类型的 SQL 验证');
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    } finally {
      if (mysqlConnection) {
        await mysqlConnection.end();
      }
    }
  }

  private mapMySQLType(mysqlType: number): string {
    // MySQL 字段类型映射
    const typeMap = {
      0: 'decimal',
      1: 'tinyint',
      2: 'smallint',
      3: 'int',
      4: 'float',
      5: 'double',
      7: 'timestamp',
      8: 'bigint',
      9: 'mediumint',
      10: 'date',
      11: 'time',
      12: 'datetime',
      13: 'year',
      15: 'varchar',
      16: 'bit',
      245: 'json',
      246: 'decimal',
      247: 'enum',
      248: 'set',
      249: 'tinytext',
      250: 'mediumtext',
      251: 'longtext',
      252: 'text',
      253: 'varchar',
      254: 'char',
    };
    return typeMap[mysqlType] || 'unknown';
  }

  async testApiDataSource(url: string, method: string, headers: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios({
        url,
        method: method || 'GET',
        headers: headers || {},
        timeout: 10000,
        validateStatus: (status) => status < 500, // 接受所有 < 500 的状态码
      });

      if (response.status >= 400) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'API 请求失败',
      };
    }
  }

  async exportDataset(id: number, format: string = 'csv'): Promise<{ data: Buffer | string; contentType: string; filename: string }> {
    const dataset = await this.findOneDataset(id);

    // 获取所有数据（不分页）
    const result = await this.previewDataset(id, 1, 999999);
    const data = result.data;
    const fields = result.fields;

    let exportData: Buffer | string;
    let contentType: string;
    let filename: string;

    // 使用安全的文件名（移除中文字符）
    const safeDatasetName = `dataset_${id}`;

    switch (format.toLowerCase()) {
      case 'csv':
        // 导出为 CSV
        const csvRows = [];

        // 添加表头
        if (fields.length > 0) {
          csvRows.push(fields.map(f => f.name).join(','));
        } else if (data.length > 0) {
          csvRows.push(Object.keys(data[0]).join(','));
        }

        // 添加数据行
        data.forEach(row => {
          const values = fields.length > 0
            ? fields.map(f => this.escapeCsvValue(row[f.name]))
            : Object.values(row).map(v => this.escapeCsvValue(v));
          csvRows.push(values.join(','));
        });

        exportData = csvRows.join('\n');
        contentType = 'text/csv';
        filename = `${safeDatasetName}_${Date.now()}.csv`;
        break;

      case 'xlsx':
        // 导出为 Excel
        try {
          const XLSX = require('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          exportData = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          filename = `${safeDatasetName}_${Date.now()}.xlsx`;
        } catch (error) {
          if (error.code === 'MODULE_NOT_FOUND') {
            throw new BadRequestException('Excel 导出功能需要安装 xlsx 包: npm install xlsx');
          }
          throw error;
        }
        break;

      case 'json':
        // 导出为 JSON
        exportData = JSON.stringify(data, null, 2);
        contentType = 'application/json';
        filename = `${safeDatasetName}_${Date.now()}.json`;
        break;

      default:
        throw new BadRequestException('不支持的导出格式，支持: csv, xlsx, json');
    }

    return {
      data: exportData,
      contentType,
      filename,
    };
  }

  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // 如果包含逗号、引号或换行符，需要用引号包裹并转义引号
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }
}
