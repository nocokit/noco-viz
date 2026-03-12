import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist, PlaylistStatus } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto, userId: number): Promise<Playlist> {
    const playlist = this.playlistsRepository.create({
      ...createPlaylistDto,
      createdById: userId,
      url: `http://view.nocoviz.com/p/${Date.now()}`,
      slides: createPlaylistDto.slides || [],
    });

    return this.playlistsRepository.save(playlist);
  }

  async findAll(status?: PlaylistStatus): Promise<Playlist[]> {
    const queryBuilder = this.playlistsRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.createdBy', 'createdBy')
      .orderBy('playlist.createdAt', 'DESC');

    // 如果指定了状态，则按状态筛选
    if (status) {
      queryBuilder.where('playlist.status = :status', { status });
    }

    const playlists = await queryBuilder.getMany();

    // 收集所有需要查询的项目ID（避免N+1查询）
    const projectIds = new Set<number>();
    for (const playlist of playlists) {
      if (playlist.slides && playlist.slides.length > 0) {
        for (const slide of playlist.slides) {
          if (slide.projectId) {
            projectIds.add(slide.projectId);
          }
        }
      }
    }

    // 一次性查询所有项目
    const projectsMap = new Map<number, Project>();
    if (projectIds.size > 0) {
      const projects = await this.projectsRepository.findByIds(Array.from(projectIds));
      projects.forEach(project => {
        projectsMap.set(project.id, project);
      });
    }

    // 填充项目信息
    for (const playlist of playlists) {
      if (playlist.slides && playlist.slides.length > 0) {
        const enrichedSlides = [];
        for (const slide of playlist.slides) {
          if (slide.projectId) {
            const project = projectsMap.get(slide.projectId);
            if (project) {
              enrichedSlides.push({
                ...slide,
                id: slide.projectId,
                name: project.title,
                version: 'v1.0',
                thumbnail: project.coverImage || '/images/project-cover.svg',
              });
            }
          }
        }
        playlist.slides = enrichedSlides;
      }
    }

    return playlists;
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!playlist) {
      throw new NotFoundException(`Playlist #${id} not found`);
    }

    // 填充项目信息到 slides
    if (playlist.slides && playlist.slides.length > 0) {
      const projectIds = playlist.slides
        .map(slide => slide.projectId)
        .filter(id => id);

      if (projectIds.length > 0) {
        const projects = await this.projectsRepository.findByIds(projectIds);
        const projectsMap = new Map<number, Project>();
        projects.forEach(project => {
          projectsMap.set(project.id, project);
        });

        playlist.slides = playlist.slides.map(slide => {
          const project = projectsMap.get(slide.projectId);
          if (project) {
            return {
              ...slide,
              name: project.title,
              type: project.type,
              thumbnail: project.coverImage || '/images/project-cover.svg',
            };
          }
          return slide;
        });
      }
    }

    return playlist;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.findOne(id);
    Object.assign(playlist, updatePlaylistDto);
    return this.playlistsRepository.save(playlist);
  }

  async remove(id: number): Promise<void> {
    const playlist = await this.findOne(id);
    await this.playlistsRepository.remove(playlist);
  }

  async updateSlides(id: number, slides: any[]): Promise<Playlist> {
    const playlist = await this.findOne(id);
    playlist.slides = slides;
    return this.playlistsRepository.save(playlist);
  }

  async addSlide(id: number, slide: any): Promise<Playlist> {
    const playlist = await this.findOne(id);
    if (!playlist.slides) {
      playlist.slides = [];
    }
    playlist.slides.push(slide);
    return this.playlistsRepository.save(playlist);
  }

  async removeSlide(id: number, slideId: number): Promise<Playlist> {
    const playlist = await this.findOne(id);
    if (playlist.slides && playlist.slides.length > 1) {
      playlist.slides = playlist.slides.filter((s) => s.id !== slideId);
      return this.playlistsRepository.save(playlist);
    }
    throw new Error('至少保留一个轮播项');
  }

  async updateStatus(id: number, status: PlaylistStatus): Promise<Playlist> {
    const playlist = await this.findOne(id);
    playlist.status = status;
    return this.playlistsRepository.save(playlist);
  }
}
