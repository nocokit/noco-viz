import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaylistStatus } from './entities/playlist.entity';

@ApiTags('playlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @ApiOperation({ summary: '创建轮播组' })
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req) {
    return this.playlistsService.create(createPlaylistDto, req.user?.id || 1);
  }

  @Get()
  @ApiOperation({ summary: '获取所有轮播组' })
  @ApiQuery({ name: 'status', required: false, enum: PlaylistStatus, description: '按状态筛选' })
  findAll(@Query('status') status?: PlaylistStatus) {
    return this.playlistsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取轮播组详情' })
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新轮播组' })
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除轮播组' })
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(+id);
  }

  @Post(':id/slides')
  @ApiOperation({ summary: '更新轮播项列表' })
  updateSlides(@Param('id') id: string, @Body() body: { slides: any[] }) {
    return this.playlistsService.updateSlides(+id, body.slides);
  }

  @Post(':id/slides/add')
  @ApiOperation({ summary: '添加轮播项' })
  addSlide(@Param('id') id: string, @Body() slide: any) {
    return this.playlistsService.addSlide(+id, slide);
  }

  @Delete(':id/slides/:slideId')
  @ApiOperation({ summary: '删除轮播项' })
  removeSlide(@Param('id') id: string, @Param('slideId') slideId: string) {
    return this.playlistsService.removeSlide(+id, +slideId);
  }

  @Post(':id/status')
  @ApiOperation({ summary: '更新播放状态' })
  updateStatus(@Param('id') id: string, @Body() body: { status: PlaylistStatus }) {
    return this.playlistsService.updateStatus(+id, body.status);
  }
}
