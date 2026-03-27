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
import { DataGroupsService } from './data-groups.service';
import { CreateDataGroupDto } from './dto/create-data-group.dto';
import { UpdateDataGroupDto } from './dto/update-data-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('data-groups')
@Controller('data-groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DataGroupsController {
  constructor(private readonly dataGroupsService: DataGroupsService) {}

  @Post()
  @ApiOperation({ summary: '创建数据集' })
  create(@Body() createDto: CreateDataGroupDto, @Request() req) {
    return this.dataGroupsService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取所有数据集' })
  findAll() {
    return this.dataGroupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取数据集详情' })
  findOne(@Param('id') id: string) {
    return this.dataGroupsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新数据集' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDataGroupDto) {
    return this.dataGroupsService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除数据集' })
  remove(@Param('id') id: string) {
    return this.dataGroupsService.remove(+id);
  }
}
