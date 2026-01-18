import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/media',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const mediaDto: CreateMediaDto = {
      name: file.originalname,
      url: `/uploads/media/${file.filename}`,
      path: file.path,
      type: this.getMediaType(file.mimetype),
      mimeType: file.mimetype,
      size: file.size,
    };

    return this.mediaService.create(mediaDto, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '创建媒体记录' })
  create(@Body() createMediaDto: CreateMediaDto, @Request() req) {
    return this.mediaService.create(createMediaDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取媒体列表' })
  findAll(@Query() query: any) {
    return this.mediaService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取媒体统计信息' })
  getStats() {
    return this.mediaService.getStats();
  }

  @Get('categories')
  @ApiOperation({ summary: '获取媒体分类列表' })
  getCategories() {
    return this.mediaService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取媒体详情' })
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新媒体信息' })
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除媒体' })
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }

  @Post('batch-delete')
  @ApiOperation({ summary: '批量删除媒体' })
  batchRemove(@Body() body: { ids: number[] }) {
    return this.mediaService.batchRemove(body.ids);
  }

  private getMediaType(mimeType: string): any {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    return 'other';
  }
}
