import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DatasetsService } from './datasets.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { UpdateDatasetDto } from './dto/update-dataset.dto';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('datasets')
@Controller('datasets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  // Dataset endpoints
  @Post()
  @ApiOperation({ summary: '创建数据集' })
  createDataset(@Body() createDatasetDto: CreateDatasetDto, @Request() req) {
    return this.datasetsService.createDataset(createDatasetDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取所有数据集' })
  findAllDatasets() {
    return this.datasetsService.findAllDatasets();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取数据集详情' })
  findOneDataset(@Param('id') id: string) {
    return this.datasetsService.findOneDataset(+id);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: '预览数据集数据' })
  previewDataset(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '100',
  ) {
    return this.datasetsService.previewDataset(+id, +page, +pageSize);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新数据集' })
  updateDatasetPut(@Param('id') id: string, @Body() updateDatasetDto: UpdateDatasetDto) {
    return this.datasetsService.updateDataset(+id, updateDatasetDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新数据集' })
  updateDataset(@Param('id') id: string, @Body() updateDatasetDto: UpdateDatasetDto) {
    return this.datasetsService.updateDataset(+id, updateDatasetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除数据集' })
  removeDataset(@Param('id') id: string) {
    return this.datasetsService.removeDataset(+id);
  }

  @Post('upload/excel')
  @ApiOperation({ summary: '上传Excel文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return this.datasetsService.uploadExcel(file);
  }

  @Post('validate-sql')
  @ApiOperation({ summary: '验证SQL查询' })
  validateSQL(@Body() body: { sql: string; connectionId: number }) {
    return this.datasetsService.validateSQL(body.sql, body.connectionId);
  }

  @Post('test-api')
  @ApiOperation({ summary: '测试API数据源' })
  testApiDataSource(@Body() body: { url: string; method: string; headers: any }) {
    return this.datasetsService.testApiDataSource(body.url, body.method, body.headers);
  }

  @Get(':id/export')
  @ApiOperation({ summary: '导出数据集数据' })
  async exportDataset(
    @Param('id') id: string,
    @Query('format') format: string = 'csv',
    @Res() res: Response,
  ) {
    const result = await this.datasetsService.exportDataset(+id, format);

    // 设置响应头
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

    // 发送数据
    res.send(result.data);
  }

  // Connection endpoints
  @Post('connections')
  @ApiOperation({ summary: '创建数据库连接' })
  createConnection(@Body() createConnectionDto: CreateConnectionDto, @Request() req) {
    return this.datasetsService.createConnection(createConnectionDto, req.user.id);
  }

  @Get('connections')
  @ApiOperation({ summary: '获取所有数据库连接' })
  findAllConnections() {
    return this.datasetsService.findAllConnections();
  }

  @Get('connections/:id')
  @ApiOperation({ summary: '获取连接详情' })
  findOneConnection(@Param('id') id: string) {
    return this.datasetsService.findOneConnection(+id);
  }

  @Put('connections/:id')
  @ApiOperation({ summary: '更新连接' })
  updateConnectionPut(@Param('id') id: string, @Body() updateConnectionDto: UpdateConnectionDto) {
    return this.datasetsService.updateConnection(+id, updateConnectionDto);
  }

  @Patch('connections/:id')
  @ApiOperation({ summary: '更新连接' })
  updateConnection(@Param('id') id: string, @Body() updateConnectionDto: UpdateConnectionDto) {
    return this.datasetsService.updateConnection(+id, updateConnectionDto);
  }

  @Delete('connections/:id')
  @ApiOperation({ summary: '删除连接' })
  removeConnection(@Param('id') id: string) {
    return this.datasetsService.removeConnection(+id);
  }

  @Post('connections/:id/test')
  @ApiOperation({ summary: '测试连接' })
  testConnection(@Param('id') id: string) {
    return this.datasetsService.testConnection(+id);
  }

  @Post('connections/test')
  @ApiOperation({ summary: '测试连接配置' })
  testConnectionConfig(@Body() config: any) {
    return this.datasetsService.testConnectionConfig(config);
  }
}
