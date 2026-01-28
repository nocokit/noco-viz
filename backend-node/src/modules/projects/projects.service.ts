import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base/base.service';
import { Project, ProjectStatus, ProjectType } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TemplatesService } from '../templates/templates.service';

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

  // @ts-ignore
  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
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
    const total = await this.projectsRepository.count();
    const published = await this.projectsRepository.count({
      where: { status: ProjectStatus.PUBLISHED },
    });
    const draft = await this.projectsRepository.count({
      where: { status: ProjectStatus.DRAFT },
    });
    const screenCount = await this.projectsRepository.count({
      where: { type: ProjectType.SCREEN },
    });
    const reportCount = await this.projectsRepository.count({
      where: { type: ProjectType.REPORT },
    });

    return {
      total,
      published,
      draft,
      byType: {
        screen: screenCount,
        report: reportCount,
      },
    };
  }

  async createFromTemplate(
    templateId: number,
    data: { name: string; description?: string },
    userId: number,
  ): Promise<Project> {
    // 获取模板信息
    const template = await this.templatesService.findOne(templateId);

    // 从模板创建项目
    const project = this.projectsRepository.create({
      title: data.name,
      description: data.description || template.description || '',
      type: ProjectType.SCREEN,
      status: ProjectStatus.DRAFT,
      createdById: userId,
      config: template.config || {}, // 从模板复制配置
    });

    return this.projectsRepository.save(project);
  }
}
