import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { DatasourcesService } from './datasources.service';
import { CreateDatasourceDto } from './dto/create-datasource.dto';
import { UpdateDatasourceDto } from './dto/update-datasource.dto';
import { TestConnectionDto } from './dto/test-connection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/datasources')
@UseGuards(JwtAuthGuard)
export class DatasourcesController {
  constructor(private readonly datasourcesService: DatasourcesService) {}

  @Post()
  create(@Body() createDatasourceDto: CreateDatasourceDto, @Request() req) {
    return this.datasourcesService.create(createDatasourceDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req) {
    // 管理员可以查看所有数据源，普通用户只能查看自己的
    const userId = req.user.roleId === 1 ? undefined : req.user.sub;
    return this.datasourcesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.datasourcesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDatasourceDto: UpdateDatasourceDto,
  ) {
    return this.datasourcesService.update(id, updateDatasourceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.datasourcesService.remove(id);
  }

  @Post('test-connection')
  testConnection(@Body() testConnectionDto: TestConnectionDto) {
    return this.datasourcesService.testConnection(testConnectionDto);
  }

  @Post(':id/test')
  testSavedConnection(@Param('id', ParseIntPipe) id: number) {
    return this.datasourcesService.testSavedConnection(id);
  }

  @Get('stats/overview')
  getDatasourceStats() {
    return this.datasourcesService.getDatasourceStats();
  }

  @Get('health/status')
  getHealthStatus() {
    return this.datasourcesService.getHealthStatus();
  }

  @Post('batch/test')
  batchTestConnections(@Body() body: { ids: number[] }) {
    return this.datasourcesService.batchTestConnections(body.ids);
  }
}
