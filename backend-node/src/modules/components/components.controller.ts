import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { QueryComponentDto } from './dto/query-component.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('components')
@UseGuards(JwtAuthGuard)
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  async create(@Body() createComponentDto: CreateComponentDto, @Request() req) {
    return this.componentsService.create(
      createComponentDto,
      req.user?.sub,
      req.user?.username,
    );
  }

  @Get()
  async findAll(@Query() queryDto: QueryComponentDto) {
    return this.componentsService.findAll(queryDto);
  }

  @Get('categories')
  async getCategories() {
    return this.componentsService.getCategories();
  }

  @Get('statistics')
  async getStatistics() {
    return this.componentsService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.componentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComponentDto: UpdateComponentDto,
  ) {
    return this.componentsService.update(id, updateComponentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.componentsService.remove(id);
    return { success: true };
  }

  @Post(':id/clone')
  async clone(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
    @Request() req,
  ) {
    return this.componentsService.clone(id, name, req.user?.sub, req.user?.username);
  }

  @Post(':id/download')
  async incrementDownloads(@Param('id', ParseIntPipe) id: number) {
    await this.componentsService.incrementDownloads(id);
    return { message: '下载次数已更新' };
  }

  @Post(':id/like')
  async toggleLike(@Param('id', ParseIntPipe) id: number, @Body('action') action: 'like' | 'unlike') {
    if (action === 'like') {
      await this.componentsService.incrementLikes(id);
    } else {
      await this.componentsService.decrementLikes(id);
    }
    return { message: '操作成功' };
  }
}
