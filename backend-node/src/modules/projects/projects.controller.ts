import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: '创建项目' })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    // 临时使用固定用户ID，后续添加JWT认证后使用 req.user.id
    return this.projectsService.create(createProjectDto, 1);
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
    // 临时使用固定用户ID，后续添加JWT认证后使用 req.user.id
    return this.projectsService.clone(+id, body.title, 1);
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
    // 临时使用固定用户ID，后续添加JWT认证后使用 req.user.id
    return this.projectsService.createFromTemplate(+templateId, body, req.user?.id || 1);
  }
}
