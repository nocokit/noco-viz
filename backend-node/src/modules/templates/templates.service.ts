import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, TemplateStatus } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto, userId: number): Promise<Template> {
    const template = this.templatesRepository.create({
      ...createTemplateDto,
      createdById: userId,
    });
    return this.templatesRepository.save(template);
  }

  async findAll(params?: any): Promise<Template[]> {
    const query = this.templatesRepository.createQueryBuilder('template')
      .leftJoinAndSelect('template.createdBy', 'createdBy')
      .orderBy('template.createdAt', 'DESC');

    if (params?.category) {
      query.andWhere('template.category = :category', { category: params.category });
    }

    if (params?.status) {
      query.andWhere('template.status = :status', { status: params.status });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Template> {
    const template = await this.templatesRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!template) {
      throw new NotFoundException(`模板 #${id} 不存在`);
    }

    return template;
  }

  async findMyTemplates(userId: number, params?: any): Promise<Template[]> {
    return this.templatesRepository.find({
      where: { createdById: userId },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const template = await this.findOne(id);
    Object.assign(template, updateTemplateDto);
    return this.templatesRepository.save(template);
  }

  async remove(id: number): Promise<void> {
    const template = await this.findOne(id);
    await this.templatesRepository.remove(template);
  }

  async publish(createTemplateDto: CreateTemplateDto, userId: number): Promise<Template> {
    const template = this.templatesRepository.create({
      ...createTemplateDto,
      createdById: userId,
      status: TemplateStatus.REVIEWING,
    });
    return this.templatesRepository.save(template);
  }

  async clone(id: number, data: any, userId: number): Promise<Template> {
    const sourceTemplate = await this.findOne(id);

    const newTemplate = this.templatesRepository.create({
      title: data.title || `${sourceTemplate.title} (副本)`,
      description: sourceTemplate.description,
      category: sourceTemplate.category,
      config: sourceTemplate.config,
      createdById: userId,
      status: TemplateStatus.DRAFT,
    });

    return this.templatesRepository.save(newTemplate);
  }

  async getCategories(): Promise<any[]> {
    return [
      { value: 'dashboard', label: '仪表板' },
      { value: 'report', label: '报表' },
      { value: 'chart', label: '图表' },
      { value: 'other', label: '其他' },
    ];
  }

  async review(id: number, data: { status: TemplateStatus; reason?: string }): Promise<Template> {
    const template = await this.findOne(id);
    template.status = data.status;
    return this.templatesRepository.save(template);
  }

  async incrementUsageCount(id: number): Promise<void> {
    const template = await this.findOne(id);
    template.usageCount += 1;
    await this.templatesRepository.save(template);
  }

  async uploadThumbnail(file: Express.Multer.File): Promise<{ url: string }> {
    // TODO: 实现文件上传到云存储
    // 这里返回模拟数据
    return {
      url: `/uploads/thumbnails/${file.originalname}`,
    };
  }
}
