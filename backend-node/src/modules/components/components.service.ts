import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomComponent } from './entities/component.entity';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { QueryComponentDto } from './dto/query-component.dto';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(CustomComponent)
    private componentsRepository: Repository<CustomComponent>,
  ) {}

  async create(createComponentDto: CreateComponentDto, userId?: number, userName?: string): Promise<CustomComponent> {
    const existingComponent = await this.componentsRepository.findOne({
      where: { name: createComponentDto.name, creatorId: userId },
    });

    if (existingComponent) {
      throw new ConflictException('组件名称已存在');
    }

    const component = this.componentsRepository.create({
      ...createComponentDto,
      creatorId: userId,
      creatorName: userName,
    });

    return this.componentsRepository.save(component);
  }

  async findAll(queryDto: QueryComponentDto) {
    const { search, category, type, isPublic, creatorId, page = 1, pageSize = 20 } = queryDto;

    const queryBuilder = this.componentsRepository.createQueryBuilder('component');

    if (search) {
      queryBuilder.andWhere(
        '(component.name LIKE :search OR component.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (category) {
      queryBuilder.andWhere('component.category = :category', { category });
    }

    if (type) {
      queryBuilder.andWhere('component.type = :type', { type });
    }

    if (isPublic !== undefined) {
      queryBuilder.andWhere('component.isPublic = :isPublic', { isPublic });
    }

    if (creatorId) {
      queryBuilder.andWhere('component.creatorId = :creatorId', { creatorId });
    }

    queryBuilder.orderBy('component.createdAt', 'DESC');

    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number): Promise<CustomComponent> {
    const component = await this.componentsRepository.findOne({ where: { id } });

    if (!component) {
      throw new NotFoundException(`组件 #${id} 不存在`);
    }

    return component;
  }

  async update(id: number, updateComponentDto: UpdateComponentDto): Promise<CustomComponent> {
    const component = await this.findOne(id);
    Object.assign(component, updateComponentDto);
    return this.componentsRepository.save(component);
  }

  async remove(id: number): Promise<void> {
    const component = await this.findOne(id);
    await this.componentsRepository.remove(component);
  }

  async incrementDownloads(id: number): Promise<void> {
    await this.componentsRepository.increment({ id }, 'downloads', 1);
  }

  async incrementLikes(id: number): Promise<void> {
    await this.componentsRepository.increment({ id }, 'likes', 1);
  }

  async decrementLikes(id: number): Promise<void> {
    await this.componentsRepository.decrement({ id }, 'likes', 1);
  }

  async getCategories(): Promise<any[]> {
    const result = await this.componentsRepository
      .createQueryBuilder('component')
      .select('component.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('component.category')
      .getRawMany();

    return result;
  }

  async getStatistics() {
    const total = await this.componentsRepository.count();
    const publicCount = await this.componentsRepository.count({ where: { isPublic: true } });
    const privateCount = total - publicCount;

    const totalDownloads = await this.componentsRepository
      .createQueryBuilder('component')
      .select('SUM(component.downloads)', 'total')
      .getRawOne();

    const totalLikes = await this.componentsRepository
      .createQueryBuilder('component')
      .select('SUM(component.likes)', 'total')
      .getRawOne();

    return {
      total,
      publicCount,
      privateCount,
      totalDownloads: parseInt(totalDownloads?.total || '0'),
      totalLikes: parseInt(totalLikes?.total || '0'),
    };
  }

  async clone(id: number, newName: string, userId?: number, userName?: string): Promise<CustomComponent> {
    const sourceComponent = await this.findOne(id);

    const newComponent = this.componentsRepository.create({
      name: newName,
      category: sourceComponent.category,
      type: sourceComponent.type,
      description: sourceComponent.description,
      thumbnail: sourceComponent.thumbnail,
      icon: sourceComponent.icon,
      config: sourceComponent.config,
      code: sourceComponent.code,
      isPublic: false,
      creatorId: userId,
      creatorName: userName,
      tags: sourceComponent.tags,
      version: '1.0.0',
    });

    return this.componentsRepository.save(newComponent);
  }
}
