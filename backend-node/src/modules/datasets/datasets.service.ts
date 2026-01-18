import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dataset } from './entities/dataset.entity';
import { Connection } from './entities/connection.entity';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { UpdateDatasetDto } from './dto/update-dataset.dto';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectRepository(Dataset)
    private datasetsRepository: Repository<Dataset>,
    @InjectRepository(Connection)
    private connectionsRepository: Repository<Connection>,
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

    // TODO: 实现真实的数据库连接测试
    // 这里只是一个示例
    connection.lastTestTime = new Date();
    connection.status = 'connected' as any;
    await this.connectionsRepository.save(connection);

    return {
      success: true,
      message: '连接成功',
    };
  }

  async testConnectionConfig(config: any): Promise<{ success: boolean; message: string }> {
    // TODO: 实现真实的数据库连接测试
    // 这里只是一个示例
    return {
      success: true,
      message: '连接配置有效',
    };
  }

  async previewDataset(id: number, page: number = 1, pageSize: number = 100): Promise<any> {
    const dataset = await this.findOneDataset(id);

    // TODO: 根据数据集类型返回实际数据
    // 这里返回模拟数据
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      fields: dataset.fields || [],
    };
  }

  async uploadExcel(file: Express.Multer.File): Promise<{ id: number; name: string; rowCount: number }> {
    // TODO: 实现 Excel 文件解析
    // 这里返回模拟数据
    return {
      id: 1,
      name: file.originalname,
      rowCount: 0,
    };
  }

  async validateSQL(sql: string, connectionId: number): Promise<{ valid: boolean; error?: string; fields?: any[] }> {
    // TODO: 实现 SQL 验证
    // 这里返回模拟数据
    return {
      valid: true,
      fields: [],
    };
  }

  async testApiDataSource(url: string, method: string, headers: any): Promise<{ success: boolean; data?: any; error?: string }> {
    // TODO: 实现 API 数据源测试
    // 这里返回模拟数据
    return {
      success: true,
      data: {},
    };
  }
}
