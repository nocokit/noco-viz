import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base/base.service';
import { Template, TemplateStatus } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService extends BaseService<Template> {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {
    super(templatesRepository);
  }

  async create(createTemplateDto: CreateTemplateDto, userId?: number): Promise<Template> {
    const template = this.templatesRepository.create({
      ...createTemplateDto,
      createdById: userId,
    });
    return this.templatesRepository.save(template);
  }

  async findAll(params?: any): Promise<Template[]> {
    const query = this.templatesRepository.createQueryBuilder('template')
      .leftJoinAndSelect('template.createdBy', 'createdBy')
      .leftJoinAndSelect('template.thumbnailMedia', 'thumbnailMedia')
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
      relations: ['createdBy', 'thumbnailMedia'],
    });
    if (!template) {
      throw new NotFoundException(`Template #${id} not found`);
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
    await this.templatesRepository
      .createQueryBuilder()
      .update(Template)
      .set({ usageCount: () => 'usage_count + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async uploadThumbnail(file: Express.Multer.File): Promise<{ url: string }> {
    // 1. 验证文件类型
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型，仅支持 JPEG、PNG、GIF、WebP 格式');
    }

    // 2. 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小超过限制（最大 5MB）');
    }

    // TODO: 实现文件上传到云存储 (AWS S3, 阿里云 OSS, 腾讯云 COS 等)
    //
    // 实现步骤：
    // 1. 安装云存储 SDK: npm install @aws-sdk/client-s3 或 ali-oss
    // 2. 配置云存储凭证（从环境变量读取）
    // 3. 上传文件到云存储
    // 4. 返回文件的公网访问 URL
    //
    // 示例代码（AWS S3）:
    // const s3Client = new S3Client({ region: process.env.AWS_REGION });
    // const key = `thumbnails/${Date.now()}-${file.originalname}`;
    // await s3Client.send(new PutObjectCommand({
    //   Bucket: process.env.S3_BUCKET,
    //   Key: key,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    // }));
    // return { url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}` };

    // 临时方案：保存到本地 uploads 目录
    const fs = require('fs').promises;
    const path = require('path');
    const uploadDir = path.join(process.cwd(), 'uploads', 'thumbnails');

    // 确保目录存在
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 3. 清理文件名，防止路径遍历攻击
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(sanitizedName);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // 4. 使用异步操作
    await fs.writeFile(filepath, file.buffer);

    return {
      url: `/uploads/thumbnails/${filename}`,
    };
  }

  async importTemplate(file: Express.Multer.File, userId: number): Promise<Template> {
    // 验证文件类型
    const allowedMimeTypes = ['application/json', 'application/zip', 'application/x-zip-compressed'];
    const allowedExtensions = ['.json', '.zip'];
    const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

    if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('不支持的文件格式，仅支持 .json 和 .zip 文件');
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小超过限制（最大 10MB）');
    }

    // 解析导入的模板文件（支持 .zip 或 .json）
    try {
      let templateData: any;

      if (file.mimetype === 'application/json' || fileExt === '.json') {
        // 解析 JSON 文件
        const jsonContent = file.buffer.toString('utf-8');
        templateData = JSON.parse(jsonContent);

        // 验证必需字段
        if (!templateData.title) {
          throw new BadRequestException('模板数据缺少必需字段: title');
        }
      } else if (file.mimetype === 'application/zip' || fileExt === '.zip') {
        // TODO: 解析 ZIP 文件，提取模板配置和资源
        // 需要安装 adm-zip 或 jszip 包
        throw new BadRequestException('ZIP 文件导入功能待实现');
      } else {
        throw new BadRequestException('不支持的文件格式');
      }

      // 创建新模板
      const template = this.templatesRepository.create({
        title: templateData.title,
        description: templateData.description || '',
        category: templateData.category || 'other',
        config: templateData.config || {},
        thumbnail: templateData.thumbnail || null,
        createdById: userId,
        status: TemplateStatus.DRAFT, // 导入的模板默认为草稿状态
      });

      return this.templatesRepository.save(template);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`导入模板失败: ${error.message}`);
    }
  }
}
