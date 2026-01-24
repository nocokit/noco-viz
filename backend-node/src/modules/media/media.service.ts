import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  /**
   * 创建媒体记录
   */
  async create(createMediaDto: CreateMediaDto, userId: number): Promise<Media> {
    const media = this.mediaRepository.create({
      ...createMediaDto,
      userId,
    });
    return this.mediaRepository.save(media);
  }

  /**
   * 获取媒体列表
   */
  async findAll(query: any): Promise<{ data: Media[]; total: number }> {
    const { page = 1, limit = 20, type, category, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.user', 'user')
      .orderBy('media.createdAt', 'DESC');

    if (type) {
      queryBuilder.andWhere('media.type = :type', { type });
    }

    if (category) {
      queryBuilder.andWhere('media.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere('media.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * 获取媒体详情
   */
  async findOne(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!media) {
      throw new NotFoundException(`Media #${id} not found`);
    }
    return media;
  }

  /**
   * 更新媒体信息
   */
  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOne(id);
    Object.assign(media, updateMediaDto);
    return this.mediaRepository.save(media);
  }

  /**
   * 删除媒体
   */
  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);
    await this.mediaRepository.remove(media);
  }

  /**
   * 批量删除媒体
   */
  async batchRemove(ids: number[]): Promise<{ deleted: number }> {
    const result = await this.mediaRepository.delete(ids);
    return { deleted: result.affected || 0 };
  }

  /**
   * 获取媒体分类列表
   */
  async getCategories(): Promise<any[]> {
    // 按类型分组统计
    const typeStats = await this.mediaRepository
      .createQueryBuilder('media')
      .select('media.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('media.type IS NOT NULL')
      .groupBy('media.type')
      .getRawMany();

    // 映射类型名称
    const typeNameMap = {
      image: '图片',
      video: '视频',
      audio: '音频',
      document: '文档',
      other: '其他',
    };

    return typeStats.map((stat, index) => ({
      id: index + 1,
      name: typeNameMap[stat.type] || stat.type,
      type: stat.type,
      count: parseInt(stat.count),
    }));
  }

  /**
   * 获取媒体统计信息
   */
  async getStats(): Promise<any> {
    const total = await this.mediaRepository.count();

    const typeStats = await this.mediaRepository
      .createQueryBuilder('media')
      .select('media.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('media.type')
      .getRawMany();

    const totalSize = await this.mediaRepository
      .createQueryBuilder('media')
      .select('SUM(media.size)', 'totalSize')
      .getRawOne();

    return {
      total,
      typeStats,
      totalSize: parseInt(totalSize.totalSize || '0'),
    };
  }
}
