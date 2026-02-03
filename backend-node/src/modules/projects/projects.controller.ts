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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BatchDeleteDto, BatchUpdateStatusDto } from '../../common/dto/batch-operation.dto';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: '创建项目' })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取所有项目' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取项目详情' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新项目' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除项目' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: '复制项目' })
  clone(
    @Param('id') id: string,
    @Body() body: { title: string },
    @Request() req,
  ) {
    return this.projectsService.clone(+id, body.title, req.user.id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布项目' })
  publish(@Param('id') id: string) {
    return this.projectsService.publish(+id);
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: '取消发布项目' })
  unpublish(@Param('id') id: string) {
    return this.projectsService.unpublish(+id);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: '获取项目统计信息' })
  getStats() {
    return this.projectsService.getStats();
  }

  @Post('from-template/:templateId')
  @ApiOperation({ summary: '从模板创建项目' })
  createFromTemplate(
    @Param('templateId') templateId: string,
    @Body() body: { name: string; description?: string },
    @Request() req,
  ) {
    return this.projectsService.createFromTemplate(+templateId, body, req.user.id);
  }

  @Post('batch/delete')
  @ApiOperation({ summary: '批量删除项目' })
  batchDelete(@Body() batchDeleteDto: BatchDeleteDto) {
    return this.projectsService.batchDelete(batchDeleteDto.ids);
  }

  @Post('batch/publish')
  @ApiOperation({ summary: '批量发布项目' })
  batchPublish(@Body() batchDeleteDto: BatchDeleteDto) {
    return this.projectsService.batchPublish(batchDeleteDto.ids);
  }

  @Post('batch/unpublish')
  @ApiOperation({ summary: '批量取消发布项目' })
  batchUnpublish(@Body() batchDeleteDto: BatchDeleteDto) {
    return this.projectsService.batchUnpublish(batchDeleteDto.ids);
  }
}
