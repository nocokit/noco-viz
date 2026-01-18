import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IpWhitelistService } from './ip-whitelist.service';
import { CreateIpWhitelistDto } from './dto/create-ip-whitelist.dto';
import { UpdateIpWhitelistDto } from './dto/update-ip-whitelist.dto';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@ApiTags('ip-whitelist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ip-whitelist')
export class IpWhitelistController {
  constructor(private readonly ipWhitelistService: IpWhitelistService) {}

  @Post()
  @ApiOperation({ summary: '添加IP白名单规则' })
  create(@Body() createDto: CreateIpWhitelistDto, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.ipWhitelistService.create(createDto, username);
  }

  @Get()
  @ApiOperation({ summary: '获取所有IP白名单规则' })
  findAll() {
    return this.ipWhitelistService.findAll();
  }

  @Get('status')
  @ApiOperation({ summary: '获取白名单启用状态' })
  getStatus() {
    return this.ipWhitelistService.getWhitelistStatus();
  }

  @Post('status')
  @ApiOperation({ summary: '更新白名单启用状态' })
  updateStatus(@Body() body: { enabled: boolean }) {
    return this.ipWhitelistService.updateWhitelistStatus(body.enabled);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个IP白名单规则' })
  findOne(@Param('id') id: string) {
    return this.ipWhitelistService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新IP白名单规则' })
  update(@Param('id') id: string, @Body() updateDto: UpdateIpWhitelistDto) {
    return this.ipWhitelistService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除IP白名单规则' })
  remove(@Param('id') id: string) {
    return this.ipWhitelistService.remove(+id);
  }
}
