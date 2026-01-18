import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatasetsService } from '../datasets/datasets.service';
import { CreateConnectionDto } from '../datasets/dto/create-connection.dto';
import { UpdateConnectionDto } from '../datasets/dto/update-connection.dto';

@ApiTags('connections')
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Post()
  @ApiOperation({ summary: '创建数据库连接' })
  create(@Body() createConnectionDto: CreateConnectionDto) {
    return this.datasetsService.createConnection(createConnectionDto, 1);
  }

  @Get()
  @ApiOperation({ summary: '获取所有数据库连接' })
  findAll() {
    return this.datasetsService.findAllConnections();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取连接详情' })
  findOne(@Param('id') id: string) {
    return this.datasetsService.findOneConnection(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新连接' })
  update(@Param('id') id: string, @Body() updateConnectionDto: UpdateConnectionDto) {
    return this.datasetsService.updateConnection(+id, updateConnectionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新连接（部分）' })
  patch(@Param('id') id: string, @Body() updateConnectionDto: UpdateConnectionDto) {
    return this.datasetsService.updateConnection(+id, updateConnectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除连接' })
  remove(@Param('id') id: string) {
    return this.datasetsService.removeConnection(+id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: '测试连接' })
  testConnection(@Param('id') id: string) {
    return this.datasetsService.testConnection(+id);
  }

  @Post('test')
  @ApiOperation({ summary: '测试连接配置' })
  testConnectionConfig(@Body() config: any) {
    return this.datasetsService.testConnectionConfig(config);
  }
}
