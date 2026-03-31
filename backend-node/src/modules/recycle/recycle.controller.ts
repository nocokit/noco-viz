import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecycleService } from './recycle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('recycle')
@Controller('recycle')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecycleController {
  constructor(private readonly recycleService: RecycleService) {}

  @Get()
  @ApiOperation({ summary: '获取回收站列表' })
  async getRecycleList(@Query('type') type?: string) {
    return this.recycleService.getRecycleList(type);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取回收站统计' })
  async getRecycleStats() {
    return this.recycleService.getRecycleStats();
  }

  @Post(':id/restore')
  @ApiOperation({ summary: '还原单个项目' })
  async restoreItem(@Param('id') id: number) {
    return this.recycleService.restoreItem(id);
  }

  @Post('restore/batch')
  @ApiOperation({ summary: '批量还原' })
  async batchRestore(@Body() data: { ids: number[] }) {
    return this.recycleService.batchRestore(data.ids);
  }

  @Delete(':id')
  @ApiOperation({ summary: '彻底删除单个项目' })
  async deleteItem(@Param('id') id: number) {
    return this.recycleService.deleteItem(id);
  }

  @Delete('batch')
  @ApiOperation({ summary: '批量彻底删除' })
  async batchDelete(@Body() data: { ids: number[] }) {
    return this.recycleService.batchDelete(data.ids);
  }

  @Delete()
  @ApiOperation({ summary: '清空回收站' })
  async emptyRecycleBin(@Query('type') type?: string) {
    return this.recycleService.emptyRecycleBin(type);
  }
}
