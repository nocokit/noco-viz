import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIntegrationPublishDto } from './dto/create-integration-publish.dto';
import { UpdateIntegrationPublishDto } from './dto/update-integration-publish.dto';
import { IntegrationPublish } from './entities/integration-publish.entity';

@Injectable()
export class IntegrationPublishService {
  constructor(
    @InjectRepository(IntegrationPublish)
    private readonly integrationPublishRepository: Repository<IntegrationPublish>,
  ) {}

  /**
   * 创建集成发布配置
   */
  async create(
    createDto: CreateIntegrationPublishDto,
  ): Promise<IntegrationPublish> {
    const config = this.integrationPublishRepository.create(createDto);
    return await this.integrationPublishRepository.save(config);
  }

  /**
   * 获取所有集成发布配置
   */
  async findAll(): Promise<IntegrationPublish[]> {
    return await this.integrationPublishRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据项目ID获取配置
   */
  async findByProjectId(projectId: number): Promise<IntegrationPublish> {
    return await this.integrationPublishRepository.findOne({
      where: { projectId },
    });
  }

  /**
   * 获取单个集成发布配置
   */
  async findOne(id: number): Promise<IntegrationPublish> {
    const config = await this.integrationPublishRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`集成发布配置 #${id} 不存在`);
    }

    return config;
  }

  /**
   * 更新集成发布配置
   */
  async update(
    id: number,
    updateDto: UpdateIntegrationPublishDto,
  ): Promise<IntegrationPublish> {
    const config = await this.findOne(id);
    Object.assign(config, updateDto);
    return await this.integrationPublishRepository.save(config);
  }

  /**
   * 删除集成发布配置
   */
  async remove(id: number): Promise<void> {
    const config = await this.findOne(id);
    await this.integrationPublishRepository.remove(config);
  }
}

