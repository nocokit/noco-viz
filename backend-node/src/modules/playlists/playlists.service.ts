import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist, PlaylistStatus } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto, userId: number): Promise<Playlist> {
    const playlist = this.playlistsRepository.create({
      ...createPlaylistDto,
      createdById: userId,
      url: `http://view.nocoviz.com/p/${Date.now()}`,
      slides: createPlaylistDto.slides || [
        {
          id: Date.now(),
          name: '新增大屏页面',
          version: 'v1.0',
          duration: 30,
          thumbnail: `https://picsum.photos/160/90?random=${Date.now()}`,
        },
      ],
    });

    return this.playlistsRepository.save(playlist);
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistsRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!playlist) {
      throw new NotFoundException(`轮播组 #${id} 不存在`);
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
