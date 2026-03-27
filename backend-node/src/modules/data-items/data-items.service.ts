import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataItem } from './entities/data-item.entity';
import { CreateDataItemDto } from './dto/create-data-item.dto';
import { UpdateDataItemDto } from './dto/update-data-item.dto';
import { Datasource } from '../datasources/entities/datasource.entity';
import axios from 'axios';

@Injectable()
export class DataItemsService {
  constructor(
    @InjectRepository(DataItem)
    private dataItemsRepository: Repository<DataItem>,
    @InjectRepository(Datasource)
    private datasourcesRepository: Repository<Datasource>,
  ) {}

  async create(createDto: CreateDataItemDto, userId: number): Promise<DataItem> {
    const item = this.dataItemsRepository.create({
      ...createDto,
      createdById: userId,
    });
    return this.dataItemsRepository.save(item);
  }

  async findAll(groupId?: number): Promise<DataItem[]> {
    const where = groupId ? { groupId } : {};
    return this.dataItemsRepository.find({
      where,
      relations: ['group', 'datasource', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<DataItem> {
    const item = await this.dataItemsRepository.findOne({
      where: { id },
      relations: ['group', 'datasource', 'createdBy'],
    });
    if (!item) {
      throw new NotFoundException(`数据项 #${id} 不存在`);
    }
    return item;
  }

  async update(id: number, updateDto: UpdateDataItemDto): Promise<DataItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.dataItemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.dataItemsRepository.remove(item);
  }

  async preview(id: number, page: number = 1, pageSize: number = 100): Promise<any> {
    const item = await this.findOne(id);

    switch (item.type) {
      case 'sql':
        return this.previewSQL(item, page, pageSize);
      case 'api':
        return this.previewAPI(item, page, pageSize);
      case 'json':
      case 'excel':
        return this.previewStatic(item, page, pageSize);
      default:
        throw new BadRequestException('不支持的数据类型');
    }
  }

  private async previewSQL(item: DataItem, page: number, pageSize: number): Promise<any> {
    if (!item.datasourceId || !item.query) {
      throw new BadRequestException('SQL 数据项缺少数据源或查询语句');
    }

    const datasource = await this.datasourcesRepository.findOne({ where: { id: item.datasourceId } });
    if (!datasource) {
      throw new NotFoundException('数据源不存在');
    }

    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: datasource.config.host,
      port: datasource.config.port,
      database: datasource.config.database,
      user: datasource.config.username,
      password: datasource.config.password,
    });

    try {
      const offset = (page - 1) * pageSize;
      const [rows] = await connection.query(`${item.query} LIMIT ? OFFSET ?`, [pageSize, offset]);
      const [[{ total }]] = await connection.query(`SELECT COUNT(*) as total FROM (${item.query}) as t`);

      return { data: rows, total, page, pageSize };
    } finally {
      await connection.end();
    }
  }

  private async previewAPI(item: DataItem, page: number, pageSize: number): Promise<any> {
    const { url, method = 'GET', headers = {} } = item.config || {};
    if (!url) {
      throw new BadRequestException('API 数据项缺少 URL');
    }

    const response = await axios({ url, method, headers, params: { page, pageSize } });
    let data = response.data;

    if (item.config?.dataPath) {
      const paths = item.config.dataPath.split('.');
      for (const path of paths) {
        data = data[path];
      }
    }

    const total = Array.isArray(data) ? data.length : data.total || 0;
    return { data: Array.isArray(data) ? data : data.data || [], total, page, pageSize };
  }

  private previewStatic(item: DataItem, page: number, pageSize: number): any {
    const data = item.data || [];
    const total = Array.isArray(data) ? data.length : 0;
    const start = (page - 1) * pageSize;

    return {
      data: Array.isArray(data) ? data.slice(start, start + pageSize) : [],
      total,
      page,
      pageSize,
    };
  }
}
