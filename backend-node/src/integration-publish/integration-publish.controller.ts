import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationPublishService } from './integration-publish.service';
import { CreateIntegrationPublishDto } from './dto/create-integration-publish.dto';
import { UpdateIntegrationPublishDto } from './dto/update-integration-publish.dto';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@ApiTags('integration-publish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integration-publish')
export class IntegrationPublishController {
  constructor(
    private readonly integrationPublishService: IntegrationPublishService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建集成发布配置' })
  create(@Body() createDto: CreateIntegrationPublishDto) {
    return this.integrationPublishService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有集成发布配置' })
  findAll() {
    return this.integrationPublishService.findAll();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: '根据项目ID获取配置' })
  findByProjectId(@Param('projectId') projectId: string) {
    return this.integrationPublishService.findByProjectId(+projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个集成发布配置' })
  findOne(@Param('id') id: string) {
    return this.integrationPublishService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新集成发布配置' })
  update(@Param('id') id: string, @Body() updateDto: UpdateIntegrationPublishDto) {
    return this.integrationPublishService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除集成发布配置' })
  remove(@Param('id') id: string) {
    return this.integrationPublishService.remove(+id);
  }
}
