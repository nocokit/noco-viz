import { Injectable, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base/base.service';
import { Project, ProjectStatus, ProjectType } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TemplatesService } from '../templates/templates.service';
import { getCurrentLicense, isProjectLimitReached } from '../../config/license.config';

@Injectable()
export class ProjectsService extends BaseService<Project> {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @Inject(forwardRef(() => TemplatesService))
    private templatesService: TemplatesService,
  ) {
    super(projectsRepository);
  }

  private async checkProjectLimit(): Promise<void> {
    const currentCount = await this.projectsRepository.count();
    if (isProjectLimitReached(currentCount)) {
      const license = getCurrentLicense();
      const communityNote = license.type === 'community' ? 'Community edition is limited to 15 projects. ' : '';
      throw new BadRequestException(
        `Project limit reached. You have ${currentCount} projects. ${communityNote}Upgrade to Professional or Enterprise for unlimited projects.`
      );
    }
  }

  async create(createProjectDto: CreateProjectDto, userId?: number): Promise<Project> {
    await this.checkProjectLimit();

    const project = this.projectsRepository.create({
      ...createProjectDto,
      createdById: userId,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async clone(id: number, newTitle: string, userId: number): Promise<Project> {
    await this.checkProjectLimit();

    const originalProject = await this.findOne(id);

    const clonedProject = this.projectsRepository.create({
      title: newTitle,
      type: originalProject.type,
      description: originalProject.description,
      coverImage: originalProject.coverImage,
      status: ProjectStatus.DRAFT,
      config: originalProject.config,
      createdById: userId,
    });

    return this.projectsRepository.save(clonedProject);
  }

  async publish(id: number): Promise<Project> {
    const project = await this.findOne(id);
    project.status = ProjectStatus.PUBLISHED;
    return this.projectsRepository.save(project);
  }

  async unpublish(id: number): Promise<Project> {
    const project = await this.findOne(id);
    project.status = ProjectStatus.DRAFT;
    return this.projectsRepository.save(project);
  }

  async getStats(): Promise<any> {
    // 使用单个聚合查询优化性能
    const stats = await this.projectsRepository
      .createQueryBuilder('project')
      .select('COUNT(*)', 'total')
      .addSelect('SUM(CASE WHEN project.status = :published THEN 1 ELSE 0 END)', 'published')
      .addSelect('SUM(CASE WHEN project.status = :draft THEN 1 ELSE 0 END)', 'draft')
      .addSelect('SUM(CASE WHEN project.type = :screen THEN 1 ELSE 0 END)', 'screenCount')
      .addSelect('SUM(CASE WHEN project.type = :report THEN 1 ELSE 0 END)', 'reportCount')
      .setParameters({
        published: ProjectStatus.PUBLISHED,
        draft: ProjectStatus.DRAFT,
        screen: ProjectType.SCREEN,
        report: ProjectType.REPORT,
      })
      .getRawOne();

    return {
      total: parseInt(stats.total) || 0,
      published: parseInt(stats.published) || 0,
      draft: parseInt(stats.draft) || 0,
      screenCount: parseInt(stats.screenCount) || 0,
      reportCount: parseInt(stats.reportCount) || 0,
    };
  }


  async createFromTemplate(
    templateId: number,
    data: { name: string; description?: string },
    userId: number,
  ): Promise<Project> {
    await this.checkProjectLimit();

    const template = await this.templatesService.findOne(templateId);

    const project = this.projectsRepository.create({
      title: data.name,
      description: data.description || template.description || '',
      type: ProjectType.SCREEN,
      status: ProjectStatus.DRAFT,
      createdById: userId,
      config: template.config || {},
    });

    return this.projectsRepository.save(project);
  }

  async batchDelete(ids: number[]) {
    return super.batchDelete(ids);
  }

  async batchPublish(ids: number[]) {
    return this.batchUpdateStatus(ids, ProjectStatus.PUBLISHED);
  }

  async batchUnpublish(ids: number[]) {
    return this.batchUpdateStatus(ids, ProjectStatus.DRAFT);
  }
}
