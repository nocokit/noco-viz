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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: '创建模板' })
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto, 1);
  }

  @Get()
  @ApiOperation({ summary: '获取模板列表' })
  findAll(@Query() params: any) {
    return this.templatesService.findAll(params);
  }

  @Get('categories')
  @ApiOperation({ summary: '获取模板分类列表' })
  getCategories() {
    return this.templatesService.getCategories();
  }

  @Get('my')
  @ApiOperation({ summary: '获取我的模板' })
  getMyTemplates(@Query() params: any) {
    return this.templatesService.findMyTemplates(1, params);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取模板详情' })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新模板' })
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(+id, updateTemplateDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新模板（部分）' })
  patch(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(+id, updateTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除模板' })
  remove(@Param('id') id: string) {
    return this.templatesService.remove(+id);
  }

  @Post('publish')
  @ApiOperation({ summary: '发布模板' })
  publish(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.publish(createTemplateDto, 1);
  }

  @Post('upload/thumbnail')
  @ApiOperation({ summary: '上传模板缩略图' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    return this.templatesService.uploadThumbnail(file);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: '复制模板' })
  clone(@Param('id') id: string, @Body() data: any) {
    return this.templatesService.clone(+id, data, 1);
  }

  @Post(':id/review')
  @ApiOperation({ summary: '审核模板' })
  review(@Param('id') id: string, @Body() data: any) {
    return this.templatesService.review(+id, data);
  }

  @Post(':id/usage')
  @ApiOperation({ summary: '增加使用次数' })
  incrementUsageCount(@Param('id') id: string) {
    return this.templatesService.incrementUsageCount(+id);
  }

  @Post('import')
  @ApiOperation({ summary: '导入模板包' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  importTemplate(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.templatesService.importTemplate(file, req.user?.id || 1);
  }
}
