import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DataItemsService } from './data-items.service';
import { CreateDataItemDto } from './dto/create-data-item.dto';
import { UpdateDataItemDto } from './dto/update-data-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('data-items')
@Controller('data-items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DataItemsController {
  constructor(private readonly dataItemsService: DataItemsService) {}

  @Post()
  @ApiOperation({ summary: '创建数据项' })
  create(@Body() createDto: CreateDataItemDto, @Request() req) {
    return this.dataItemsService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取数据项列表' })
  findAll(@Query('groupId') groupId?: string) {
    return this.dataItemsService.findAll(groupId ? +groupId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取数据项详情' })
  findOne(@Param('id') id: string) {
    return this.dataItemsService.findOne(+id);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: '预览数据' })
  preview(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '100',
  ) {
    return this.dataItemsService.preview(+id, +page, +pageSize);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新数据项' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDataItemDto) {
    return this.dataItemsService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除数据项' })
  remove(@Param('id') id: string) {
    return this.dataItemsService.remove(+id);
  }
}
